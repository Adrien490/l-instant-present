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
import { Group } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { isGroupAdmin } from "../queries/is-group-admin";
import groupFormSchema from "../schemas/group-form-schema";
import { uploadGroupImage } from "./upload-group-image";

export default async function editGroup(
	_: ServerActionState<Group, typeof groupFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Group, typeof groupFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier ce groupe"
			);
		}

		const groupId = formData.get("id")?.toString();
		if (!groupId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'identifiant du groupe est manquant"
			);
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(groupId);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour modifier ce groupe"
			);
		}

		// Gérer l'upload de l'image
		const imageResult = await uploadGroupImage(null, formData);
		if (imageResult.status !== ServerActionStatus.SUCCESS) {
			return createErrorResponse(imageResult.status, imageResult.message);
		}

		const rawData = {
			id: groupId,
			name: formData.get("name")?.toString() || "",
			description: formData.get("description")?.toString() || null,
			imageUrl:
				imageResult.data?.url || formData.get("imageUrl")?.toString() || null,
		};

		const validation = groupFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const group = await db.group.update({
			where: { id: groupId },
			data: {
				name: validation.data.name,
				description: validation.data.description,
				imageUrl: validation.data.imageUrl || undefined,
			},
		});

		revalidateTag("groups");
		revalidateTag(`groups:user:${session.user.id}`);
		revalidateTag(`group-${groupId}`);

		return createSuccessResponse(
			group,
			`Le groupe ${group.name} a été modifié avec succès`
		);
	} catch (error) {
		console.error("[EDIT_GROUP]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le groupe"
		);
	}
}
