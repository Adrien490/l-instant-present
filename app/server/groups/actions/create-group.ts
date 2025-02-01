"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Group, GroupRole } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import createGroupSchema from "../schemas/create-group-schema";

export default async function createGroup(
	_: ServerActionState<Group, typeof createGroupSchema> | null,
	formData: FormData
): Promise<ServerActionState<Group, typeof createGroupSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un groupe"
			);
		}

		const rawData = {
			name: formData.get("name")?.toString() || "",
			description: formData.get("description")?.toString() || null,
			imageUrl: formData.get("imageUrl")?.toString() || null,
		};

		const validation = createGroupSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const group = await db.group.create({
			data: {
				name: validation.data.name,
				description: validation.data.description,
				imageUrl: validation.data.imageUrl,
				owner: {
					connect: {
						id: session.user.id,
					},
				},
				members: {
					create: {
						userId: session.user.id,
						role: GroupRole.ADMIN,
					},
				},
			},
		});

		revalidateTag("groups");
		revalidateTag(`groups:user:${session.user.id}`);

		return createSuccessResponse(
			group,
			`Le groupe ${group.name} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_GROUP]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le groupe"
		);
	}
}
