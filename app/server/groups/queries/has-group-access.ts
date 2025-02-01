"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

/**
 * Vérifie si l'utilisateur a accès au groupe
 */
export async function hasGroupAccess(groupId: string): Promise<boolean> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return false;
		}

		const checkAccess = async () => {
			const group = await db.group.findFirst({
				where: {
					id: groupId,
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
				select: {
					id: true,
				},
			});

			return !!group;
		};

		return unstable_cache(
			checkAccess,
			[`group-access-${groupId}-${session.user.id}`],
			{
				revalidate: 60,
				tags: ["groups"],
			}
		)();
	} catch (error) {
		console.error("[HAS_GROUP_ACCESS_ERROR]", { groupId, error });
		return false;
	}
}
