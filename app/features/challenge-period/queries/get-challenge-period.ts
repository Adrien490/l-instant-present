"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { QueryResponse, QueryStatus } from "@/types/query";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getChallengePeriodSchema, {
	GetChallengePeriodParams,
} from "../schemas/get-challenge-period-schema";

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
	challenges: {
		select: {
			id: true,
			title: true,
			description: true,
			difficulty: true,
			points: true,
			completions: {
				select: {
					id: true,
					status: true,
					userId: true,
					proof: true,
					completedAt: true,
				},
			},
		},
	},
} satisfies Prisma.ChallengePeriodSelect;

export type GetChallengePeriodResponse = Prisma.ChallengePeriodGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

/**
 * Récupère une période de défi par son ID
 */
export default async function getChallengePeriod(
	params: GetChallengePeriodParams
): Promise<QueryResponse<GetChallengePeriodResponse>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return {
				status: QueryStatus.ERROR,
				message: "Vous devez être connecté pour accéder à cette page",
			};
		}

		const validation = getChallengePeriodSchema.safeParse(params);
		if (!validation.success) {
			return {
				status: QueryStatus.ERROR,
				message: "Paramètres invalides",
			};
		}

		const validatedParams = validation.data;
		const cacheKey = `period:${validatedParams.id}:group:${validatedParams.groupId}:user:${session.user.id}`;

		const getData = async () => {
			return await Promise.race([
				db.challengePeriod.findFirst({
					where: {
						id: validatedParams.id,
						groupId: validatedParams.groupId,
						group: {
							members: {
								some: {
									userId: session.user.id,
								},
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

		const data = await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: [
				`group:${validatedParams.groupId}`,
				`group-periods:${validatedParams.groupId}`,
				`period:${validatedParams.id}`,
			],
		})();

		return {
			status: QueryStatus.SUCCESS,
			data,
		};
	} catch (error) {
		console.error("[GET_CHALLENGE_PERIOD_ERROR]", { params, error });
		return {
			status: QueryStatus.ERROR,
			message: "Une erreur est survenue lors de la récupération de la période",
		};
	}
}
