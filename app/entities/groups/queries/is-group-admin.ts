"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { GroupRole } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import groupAdminSchema from "../schemas/group-admin-schema";

/**
 * Vérifie si l'utilisateur est admin du groupe
 */
export async function isGroupAdmin(groupId: string): Promise<boolean> {
	try {
		const validation = groupAdminSchema.safeParse({ groupId });
		if (!validation.success) {
			return false;
		}

		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return false;
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

		return unstable_cache(
			checkAdmin,
			[`group-admin-${groupId}-${session.user.id}`],
			{
				revalidate: 60,
				tags: ["groups"],
			}
		)();
	} catch (error) {
		console.error("[IS_GROUP_ADMIN_ERROR]", { groupId, error });
		return false;
	}
}
