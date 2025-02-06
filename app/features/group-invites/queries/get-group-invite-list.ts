"use server";

import { auth } from "@/lib/auth";
import db, { DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import getGroupInviteListSchema, {
	GetGroupInviteListParams,
} from "../schemas/get-group-invite-list-schema";

// Constants
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
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

export type GetGroupInviteListResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetGroupInviteListParams,
	session: { user: { id: string; email: string } }
): Prisma.GroupInviteWhereInput => {
	return {
		status: params.status,
		...(params.type === "sent"
			? { senderId: session.user.id }
			: { email: session.user.email }),
	};
};

export default async function getGroupInviteList(
	params: GetGroupInviteListParams
): Promise<GetGroupInviteListResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupInviteListSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, session);

		const data = await Promise.race([
			db.groupInvite.findMany({
				where,
				select: DEFAULT_SELECT,
				orderBy: [{ createdAt: "desc" }, { id: "desc" }],
				take: validatedParams.take,
			}),
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
			),
		]);

		return data;
	} catch (error) {
		console.error("[GET_GROUP_INVITE_LIST]", error);
		throw new Error("An error occurred while fetching the group invites");
	}
}
