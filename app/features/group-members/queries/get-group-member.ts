"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupMemberSchema from "../schemas/get-group-member-schema";

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

		const validation = getGroupMemberSchema.safeParse({ groupId, userId });
		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const validatedParams = validation.data;

		const getGroupMemberFromDb = async () => {
			const member = await db.groupMember.findFirst({
				where: {
					groupId: validatedParams.groupId,
					userId: validatedParams.userId,
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
				return null;
			}

			return member;
		};

		const data = await unstable_cache(
			getGroupMemberFromDb,
			[`group-member-${groupId}-${userId}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.MEDIUM,
				tags: ["groups", `group-${groupId}`],
			}
		)();

		return data;
	} catch (error) {
		console.error("[GET_GROUP_MEMBER_ERROR]", { groupId, userId, error });
		throw new Error(
			"Une erreur est survenue lors de la récupération du membre"
		);
	}
}
