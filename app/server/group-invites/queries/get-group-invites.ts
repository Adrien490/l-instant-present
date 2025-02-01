"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { isGroupAdmin } from "../../groups/queries/is-group-admin";

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
} satisfies Prisma.GroupInviteSelect;

export type GetGroupInvitesResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

export async function getGroupInvites(
	groupId: string
): Promise<GetGroupInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(groupId);
		if (!isAdmin) {
			throw new Error("Vous n'avez pas les droits pour voir les invitations");
		}

		const getGroupInvitesFromDb = async () => {
			const invites = await db.groupInvite.findMany({
				where: {
					groupId,
					status: "PENDING",
				},
				select: DEFAULT_SELECT,
				orderBy: { createdAt: "desc" },
			});

			return invites;
		};

		return unstable_cache(
			getGroupInvitesFromDb,
			[`group-invites-${groupId}-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.MEDIUM,
				tags: ["groups", `group-${groupId}`],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_INVITES_ERROR]", { groupId, error });
		return [];
	}
}
