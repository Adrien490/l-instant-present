"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

const DEFAULT_SELECT = {
	id: true,
	role: true,
	joinedAt: true,
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	},
} satisfies Prisma.GroupMemberSelect;

export type GetGroupMemberResponse = Prisma.GroupMemberGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

export async function getGroupMember(
	groupId: string,
	userId: string
): Promise<GetGroupMemberResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const getGroupMemberFromDb = async () => {
			const member = await db.groupMember.findFirst({
				where: {
					groupId,
					userId,
					group: {
						members: {
							some: {
								userId: session.user.id,
							},
						},
					},
				},
				select: DEFAULT_SELECT,
			});

			if (!member) {
				throw new Error("Membre non trouvé");
			}

			return member;
		};

		return unstable_cache(
			getGroupMemberFromDb,
			[`group-member-${groupId}-${userId}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.MEDIUM,
				tags: ["groups", `group-${groupId}`],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_MEMBER_ERROR]", { groupId, userId, error });
		return null;
	}
}
