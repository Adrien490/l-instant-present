"use server";

import { auth } from "@/lib/auth";
import db, { DB_TIMEOUTS } from "@/lib/db";
import { QueryResponse, QueryStatus } from "@/types/query";
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
): Promise<QueryResponse<GetGroupInviteResponse>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return {
				status: QueryStatus.ERROR,
				message: "Unauthorized",
			};
		}

		const validation = getGroupInviteSchema.safeParse(params);
		if (!validation.success) {
			return {
				status: QueryStatus.ERROR,
				message: "Invalid parameters",
			};
		}

		const validatedParams = validation.data;

		const data = await Promise.race([
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

		return {
			status: QueryStatus.SUCCESS,
			data,
		};
	} catch (error) {
		console.error("[GET_GROUP_INVITE]", error);
		return {
			status: QueryStatus.ERROR,
			message: "An error occurred while fetching the group invite",
		};
	}
}
