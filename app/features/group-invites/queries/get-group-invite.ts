"use server";

import { auth } from "@/lib/auth";
import db, { DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import {
	GetGroupInviteParams,
	getGroupInviteSchema,
} from "../schemas/get-group-invite-schema";

// Constants
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

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

export type GetGroupInviteResponse = Prisma.GroupInviteGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

export default async function getGroupInvite(
	params: GetGroupInviteParams
): Promise<GetGroupInviteResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupInviteSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return await Promise.race([
			db.groupInvite.findUnique({
				where: {
					id: validatedParams.inviteId,
					OR: [{ senderId: session.user.id }, { email: session.user.email }],
				},
				select: DEFAULT_SELECT,
			}),
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
			),
		]);
	} catch (error) {
		console.error("[GET_GROUP_INVITE]", error);
		return null;
	}
}
