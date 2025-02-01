"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupsSchema, { GetGroupsParams } from "../schemas/get-groups-schema";

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

export type GetGroupsResponse = Array<
	Prisma.GroupGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetGroupsParams,
	userId: string
): Prisma.GroupWhereInput => {
	const baseWhere: Prisma.GroupWhereInput = {
		members: {
			some: {
				userId,
			},
		},
	};

	if (!params.search) {
		return baseWhere;
	}

	return {
		AND: [
			baseWhere,
			{
				name: { contains: params.search, mode: "insensitive" },
			},
		],
	};
};

export default async function getGroups(
	params: GetGroupsParams
): Promise<GetGroupsResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, session.user.id);
		const cacheKey = `groups:user:${session.user.id}${
			params.search ? `:search:${params.search}` : ""
		}`;

		const getData = async () => {
			return await Promise.race([
				db.group.findMany({
					where,
					select: DEFAULT_SELECT,
					orderBy: [{ createdAt: "desc" }, { id: "desc" }],
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);
		};

		return await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: ["groups:list", `groups:user:${session.user.id}`],
		})();
	} catch (error) {
		console.error("[GET_GROUPS]", error);
		return [];
	}
}
