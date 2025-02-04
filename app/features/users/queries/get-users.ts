"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getUsersSchema, { GetUsersParams } from "../schemas/get-users-schema";

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

export type GetUsersResponse = Array<
	Prisma.UserGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (params: GetUsersParams): Prisma.UserWhereInput => {
	const conditions: Prisma.UserWhereInput[] = [];

	if (params.search) {
		conditions.push({
			OR: [
				{ name: { contains: params.search, mode: "insensitive" } },
				{ email: { contains: params.search, mode: "insensitive" } },
			],
		});
	}

	return conditions.length > 0 ? { AND: conditions } : {};
};

export default async function getUsers(
	params: GetUsersParams
): Promise<GetUsersResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getUsersSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);
		const cacheKey = `users${params.search ? `:search:${params.search}` : ""}${
			params.take ? `:take:${params.take}` : ""
		}`;

		const getData = async () => {
			return await Promise.race([
				db.user.findMany({
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

		return await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: ["users:list", `users:search:${params.search || "all"}`],
		})();
	} catch (error) {
		console.error("[GET_USERS]", error);
		return [];
	}
}
