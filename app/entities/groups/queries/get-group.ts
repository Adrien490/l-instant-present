"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupSchema, { GetGroupParams } from "../schemas/get-group-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
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

		const validatedParams = validation.data;
		const cacheKey = `group:${validatedParams.id}:user:${session.user.id}`;

		const getData = async () => {
			return await Promise.race([
				db.group.findFirst({
					where: {
						id: validatedParams.id,
						members: {
							some: {
								userId: session.user.id,
							},
						},
					},
					select: DEFAULT_SELECT,
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);
		};

		const group = await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: [
				"groups",
				`group:${validatedParams.id}`,
				`groups:user:${session.user.id}`,
			],
		})();

		if (!group) {
			throw new Error("Groupe non trouvé");
		}

		return group;
	} catch (error) {
		console.error("[GET_GROUP_ERROR]", { params, error });
		throw error instanceof Error
			? error
			: new Error("Erreur lors de la récupération du groupe");
	}
}
