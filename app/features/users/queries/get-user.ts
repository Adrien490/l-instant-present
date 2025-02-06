"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getUserSchema, { GetUserParams } from "../schemas/get-user-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
const DEFAULT_SELECT = {
	id: true,
	name: true,
	email: true,
	image: true,
	emailVerified: true,
	createdAt: true,
	updatedAt: true,
	ownedGroups: {
		select: {
			id: true,
			name: true,
			imageUrl: true,
		},
	},
	memberships: {
		select: {
			role: true,
			group: {
				select: {
					id: true,
					name: true,
					imageUrl: true,
				},
			},
		},
	},
} satisfies Prisma.UserSelect;

export type GetUserResponse = Prisma.UserGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

/**
 * Récupère un utilisateur par son ID
 */
export default async function getUser(
	params: GetUserParams
): Promise<GetUserResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const validation = getUserSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("ID d'utilisateur invalide");
		}

		const validatedParams = validation.data;
		const cacheKey = `user:${validatedParams.id}`;

		const getData = async () => {
			return await Promise.race([
				db.user.findUnique({
					where: {
						id: validatedParams.id,
					},
					select: DEFAULT_SELECT,
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);
		};

		const data = await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: ["users", `user:${validatedParams.id}`],
		})();

		return data;
	} catch (error) {
		console.error("[GET_USER_ERROR]", { params, error });
		throw new Error(
			"Une erreur est survenue lors de la récupération de l'utilisateur"
		);
	}
}
