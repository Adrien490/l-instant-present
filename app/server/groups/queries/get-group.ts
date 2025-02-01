"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupSchema, { GetGroupParams } from "../schemas/get-group-schema";

const DEFAULT_SELECT = {
	id: true,
	name: true,
	description: true,
	imageUrl: true,
	createdAt: true,
	updatedAt: true,
	ownerId: true,
	members: {
		select: {
			role: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	},
} satisfies Prisma.GroupSelect;

export type GetGroupResponse = Prisma.GroupGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;

/**
 * Récupère un groupe par son ID
 */
export async function getGroup(
	params: GetGroupParams
): Promise<GetGroupResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const validation = getGroupSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("ID de groupe invalide");
		}

		const getGroupFromDb = async () => {
			const group = await db.group.findFirst({
				where: {
					id: validation.data.id,
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
				select: DEFAULT_SELECT,
			});

			if (!group) {
				throw new Error("Groupe non trouvé");
			}

			return group;
		};

		return unstable_cache(
			getGroupFromDb,
			[`group-${params.id}-${session.user.id}`],
			{
				revalidate: 60,
				tags: ["groups"],
			}
		)();
	} catch (error) {
		console.error("[GET_GROUP_ERROR]", { params, error });
		throw error instanceof Error
			? error
			: new Error("Erreur lors de la récupération du groupe");
	}
}
