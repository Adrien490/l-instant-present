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

export type GetGroupInviteResponse = Prisma.GroupInviteGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

export async function getGroupInvite(
	inviteId: string
): Promise<GetGroupInviteResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const getInviteFromDb = async () => {
			const invite = await db.groupInvite.findUnique({
				where: {
					id: inviteId,
					OR: [{ senderId: session.user.id }, { email: session.user.email }],
				},
				select: DEFAULT_SELECT,
			});

			if (!invite) {
				throw new Error("Invitation non trouvée");
			}

			return invite;
		};

		return unstable_cache(
			getInviteFromDb,
			[`invite-${inviteId}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.VERY_SHORT,
				tags: [
					"invites",
					`invite-${inviteId}`,
					`user-invites-${session.user.id}`,
				],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_INVITE]", error);
		return null;
	}
}
