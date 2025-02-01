"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

const DEFAULT_SELECT = {
	id: true,
	status: true,
	createdAt: true,
	group: {
		select: {
			id: true,
			name: true,
			members: {
				select: {
					userId: true,
				},
			},
		},
	},
} satisfies Prisma.GroupInviteSelect;

export type GetUserInvitesResponse = Array<
	Prisma.GroupInviteGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

export async function getUserInvites(): Promise<GetUserInvitesResponse> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const getUserInvitesFromDb = async () => {
			return await db.groupInvite.findMany({
				where: {
					email: session.user.email,
					status: "PENDING",
				},
				select: DEFAULT_SELECT,
				orderBy: { createdAt: "desc" },
			});
		};

		return unstable_cache(
			getUserInvitesFromDb,
			[`user-invites-${session.user.id}`],
			{
				revalidate: CACHE_TIMES.MEDIUM,
				tags: ["groups"],
			}
		)();
	} catch (error) {
		console.error("[GET_USER_INVITES]", error);
		return [];
	}
}
