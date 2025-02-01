"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

const DEFAULT_SELECT = {
	id: true,
	email: true,
	status: true,
	createdAt: true,
	sender: {
		select: {
			name: true,
			image: true,
		},
	},
	group: {
		select: {
			id: true,
			name: true,
			members: {
				select: {
					userId: true,
				},
			},
		},
	},
} satisfies Prisma.GroupInviteSelect;

export type GetUserInvitesResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

export async function getUserInvites(): Promise<GetUserInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		return await db.groupInvite.findMany({
			where: {
				email: session.user.email,
				status: "PENDING",
			},
			select: DEFAULT_SELECT,
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		console.error("[GET_USER_INVITES]", error);
		return [];
	}
}
