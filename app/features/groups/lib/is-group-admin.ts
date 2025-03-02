"use server";

import groupAdminSchema from "@/app/features/groups/schemas/group-admin-schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { GroupRole } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

/**
 * Vérifie si l'utilisateur est admin du groupe
 */
export default async function isGroupAdmin(groupId: string) {
	try {
		const validation = groupAdminSchema.safeParse({ groupId });
		if (!validation.success) {
			throw new Error("ID de groupe invalide");
		}

		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const checkAdmin = async () => {
			const membership = await db.groupMember.findFirst({
				where: {
					groupId,
					userId: session.user.id,
					role: GroupRole.ADMIN,
				},
				select: {
					id: true,
				},
			});

			return !!membership;
		};

		const data = await unstable_cache(
			checkAdmin,
			[`group-admin-${groupId}-${session.user.id}`],
			{
				revalidate: 60,
				tags: ["groups"],
			}
		)();

		return data;
	} catch (error) {
		console.error("[IS_GROUP_ADMIN_ERROR]", { groupId, error });
		throw new Error(
			"Une erreur est survenue lors de la vérification des droits"
		);
	}
}
