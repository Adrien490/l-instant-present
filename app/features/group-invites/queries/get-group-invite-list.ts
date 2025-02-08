"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getGroupInviteListSchema, {
	GetGroupInviteListParams,
} from "../schemas/get-group-invite-list-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
const DEFAULT_SELECT = {
	id: true,
	email: true,
	status: true,
	createdAt: true,
	expiresAt: true,
	senderId: true,
	sender: {
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	},
	group: {
		select: {
			id: true,
			name: true,
			description: true,
			imageUrl: true,
			members: {
				select: {
					userId: true,
					role: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
			},
		},
	},
} satisfies Prisma.GroupInviteSelect;

export type GetGroupInviteListResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetGroupInviteListParams,
	session: { user: { id: string; email: string } }
): Prisma.GroupInviteWhereInput => {
	const conditions: Prisma.GroupInviteWhereInput[] = [];

	// Filtre par type
	if (params.filter === "sent") {
		conditions.push({ senderId: session.user.id });
	} else {
		conditions.push({ email: session.user.email });
	}

	// Filtre par statut
	if (params.status) {
		conditions.push({ status: params.status });
	}

	// Filtre de recherche
	if (params.search) {
		conditions.push({
			OR: [
				{ group: { name: { contains: params.search, mode: "insensitive" } } },
				{ sender: { name: { contains: params.search, mode: "insensitive" } } },
				{ email: { contains: params.search, mode: "insensitive" } },
			],
		});
	}

	return { AND: conditions };
};

export default async function getGroupInviteList(
	params: GetGroupInviteListParams
): Promise<GetGroupInviteListResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getGroupInviteListSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, session);

		// Construction de la clé de cache
		const cacheKey = `invites:user:${session.user.id}${
			params.filter ? `:filter:${params.filter}` : ""
		}${params.search ? `:search:${params.search}` : ""}${
			params.status ? `:status:${params.status}` : ""
		}`;

		const getData = async () => {
			const [items] = await Promise.all([
				Promise.race([
					db.groupInvite.findMany({
						where,
						select: DEFAULT_SELECT,
						orderBy: [{ createdAt: "desc" }, { id: "desc" }],
						take: validatedParams.take,
					}),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
					),
				]),
			]);

			return items;
		};

		const data = await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: [
				"invites:list",
				`invites:user:${session.user.id}`,
				`invites:filter:${params.filter || "received"}`,
				`invites:search:${params.search || "all"}`,
			],
		})();

		return data;
	} catch (error) {
		console.error("[GET_GROUP_INVITE_LIST]", error);
		throw new Error("An error occurred while fetching the group invites");
	}
}
