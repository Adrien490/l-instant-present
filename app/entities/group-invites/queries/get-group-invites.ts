"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import getGroupInvitesSchema, {
	GetGroupInvitesParams,
} from "../schemas/get-group-invites-schema";

const DEFAULT_SELECT = {
	id: true,
	email: true,
	status: true,
	createdAt: true,
	expiresAt: true,
	senderId: true,
	sender: {
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	},
	group: {
		select: {
			id: true,
			name: true,
			description: true,
			imageUrl: true,
			members: {
				select: {
					userId: true,
					role: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
			},
		},
	},
} satisfies Prisma.GroupInviteSelect;

export type GetGroupInvitesResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

export async function getGroupInvites(
	params: GetGroupInvitesParams
): Promise<GetGroupInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupInvitesSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return db.groupInvite.findMany({
			where: {
				status: validatedParams.status,
				...(validatedParams.type === "sent"
					? { senderId: session.user.id }
					: { email: session.user.email }),
			},
			select: DEFAULT_SELECT,
			orderBy: { createdAt: "desc" },
			take: validatedParams.take,
		});
	} catch (error) {
		console.error("[GET_GROUP_INVITES]", error);
		return [];
	}
}
