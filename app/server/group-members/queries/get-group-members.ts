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

export type GetGroupMembersResponse = Array<
	Prisma.GroupMemberGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

export async function getGroupMembers(
	groupId: string
): Promise<GetGroupMembersResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const getGroupMembersFromDb = async () => {
			const members = await db.groupMember.findMany({
				where: {
					groupId,
					group: {
						members: {
							some: {
								userId: session.user.id,
							},
						},
					},
				},
				select: DEFAULT_SELECT,
				orderBy: [{ role: "asc" }, { joinedAt: "desc" }],
			});

			return members;
		};

		return unstable_cache(
			getGroupMembersFromDb,
			[`group-members-${groupId}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.MEDIUM,
				tags: ["groups", `group-${groupId}`],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_MEMBERS_ERROR]", { groupId, error });
		return [];
	}
}
