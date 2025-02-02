"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { GroupInviteStatus, Prisma } from "@prisma/client";
import { headers } from "next/headers";

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

interface GetGroupInvitesOptions {
	type?: "sent" | "received";
	status?: GroupInviteStatus;
}

export async function getGroupInvites({
	type = "received",
	status = GroupInviteStatus.PENDING,
}: GetGroupInvitesOptions = {}): Promise<GetGroupInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		return db.groupInvite.findMany({
			where: {
				status,
				...(type === "sent"
					? { senderId: session.user.id }
					: { email: session.user.email }),
			},
			select: DEFAULT_SELECT,
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		console.error("[GET_GROUP_INVITES]", error);
		return [];
	}
}
