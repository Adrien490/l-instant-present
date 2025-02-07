"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getChallengePeriodListSchema, {
	GetChallengePeriodListParams,
} from "../schemas/get-challenge-period-list-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
const DEFAULT_SELECT = {
	id: true,
	name: true,
	startDate: true,
	endDate: true,
	groupId: true,
	createdAt: true,
	updatedAt: true,
	_count: {
		select: {
			challenges: true,
		},
	},
} satisfies Prisma.ChallengePeriodSelect;

export type GetChallengePeriodListResponse = Array<
	Prisma.ChallengePeriodGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetChallengePeriodListParams,
	userId: string
): Prisma.ChallengePeriodWhereInput => {
	const conditions: Prisma.ChallengePeriodWhereInput[] = [
		{
			groupId: params.groupId,
			group: {
				members: {
					some: {
						userId,
					},
				},
			},
		},
	];

	if (params.search) {
		conditions.push({
			name: { contains: params.search, mode: "insensitive" },
		});
	}

	return { AND: conditions };
};

/**
 * Récupère la liste des périodes de défi d'un groupe
 */
export default async function getChallengePeriodList(
	params: GetChallengePeriodListParams
): Promise<GetChallengePeriodListResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const validation = getChallengePeriodListSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, session.user.id);
		const cacheKey = `group-periods:${validatedParams.groupId}:user:${
			session.user.id
		}${params.search ? `:search:${params.search}` : ""}${
			params.take ? `:take:${params.take}` : ""
		}`;

		const getData = async () => {
			return await Promise.race([
				db.challengePeriod.findMany({
					where,
					select: DEFAULT_SELECT,
					orderBy: validatedParams.orderBy
						? Object.entries(validatedParams.orderBy).map(([key, value]) => ({
								[key]: value,
						  }))
						: [{ startDate: "desc" }, { id: "desc" }],
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
				`group:${validatedParams.groupId}`,
				`group-periods:${validatedParams.groupId}`,
				`periods:search:${params.search || "all"}`,
			],
		})();

		return data;
	} catch (error) {
		console.error("[GET_CHALLENGE_PERIOD_LIST]", error);
		throw new Error(
			"Une erreur est survenue lors de la récupération des périodes"
		);
	}
}
