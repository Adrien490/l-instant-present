"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupListSchema, {
	GetGroupListParams,
} from "../schemas/get-group-list-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
const DEFAULT_SELECT = {
	id: true,
	name: true,
	description: true,
	createdAt: true,
	updatedAt: true,
	ownerId: true,
	imageUrl: true,
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

export type GetGroupListResponse = Array<
	Prisma.GroupGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Dans get-group-list.ts
const buildWhereClause = (
	params: GetGroupListParams,
	userId: string
): Prisma.GroupWhereInput => {
	const conditions: Prisma.GroupWhereInput[] = [];

	// Filtre selon le type de vue
	switch (params.filter) {
		case "owned":
			conditions.push({
				ownerId: userId,
			});
			break;
		case "joined":
			conditions.push({
				AND: [
					{
						members: {
							some: {
								userId,
							},
						},
					},
					{
						ownerId: {
							not: userId,
						},
					},
				],
			});
			break;
		default:
			// "all" - montre tous les groupes où l'utilisateur est membre
			conditions.push({
				members: {
					some: {
						userId,
					},
				},
			});
	}

	// Ajout du filtre de recherche
	if (params.search) {
		conditions.push({
			name: { contains: params.search, mode: "insensitive" },
		});
	}

	return { AND: conditions };
};

export default async function getGroupList(
	params: GetGroupListParams
): Promise<GetGroupListResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupListSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		const where = buildWhereClause(validatedParams, session.user.id);

		// Mise à jour de la clé de cache pour inclure le type de vue
		const cacheKey = `groups:user:${session.user.id}${
			params.filter ? `:filter:${params.filter}` : ""
		}${params.search ? `:search:${params.search}` : ""}${
			params.take ? `:take:${params.take}` : ""
		}`;

		const getData = async () => {
			return await Promise.race([
				db.group.findMany({
					where,
					select: DEFAULT_SELECT,
					orderBy: validatedParams.orderBy
						? Object.entries(validatedParams.orderBy).map(([key, value]) => ({
								[key]: value,
						  }))
						: [{ createdAt: "desc" }, { id: "desc" }],
					take: validatedParams.take,
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);
		};

		const data = await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: [
				"groups:list",
				`groups:user:${session.user.id}`,
				`groups:filter:${params.filter || "all"}`,
				`groups:search:${params.search || "all"}`,
			],
		})();

		return data;
	} catch (error) {
		console.error("[GET_GROUPS]", error);
		throw new Error("An error occurred while fetching groups");
	}
}
