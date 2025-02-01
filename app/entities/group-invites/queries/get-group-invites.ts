"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

const DEFAULT_SELECT = {
	id: true,
	email: true,
	status: true,
	createdAt: true,
	expiresAt: true,
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
			members: {
				select: {
					userId: true,
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
	status?: "PENDING" | "ACCEPTED" | "REJECTED";
}

export async function getGroupInvites({
	type = "received",
	status = "PENDING",
}: GetGroupInvitesOptions = {}): Promise<GetGroupInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const getInvitesFromDb = async () => {
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
		};

		return unstable_cache(
			getInvitesFromDb,
			[`invites-${type}-${status}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.VERY_SHORT,
				tags: [
					"invites",
					`user-invites-${session.user.id}`,
					type === "sent"
						? `sent-invites-${session.user.id}`
						: `received-invites-${session.user.email}`,
				],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_INVITES]", error);
		return [];
	}
}
