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
import deleteGroupSchema from "../schemas/delete-group-schema";

export default async function deleteGroup(
	_: ServerActionState<Group, typeof deleteGroupSchema> | null,
	formData: FormData
): Promise<ServerActionState<Group, typeof deleteGroupSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer ce groupe"
			);
		}

		const rawData = {
			id: formData.get("id")?.toString() || "",
			confirmName: formData.get("confirmName")?.toString() || "",
		};

		const validation = deleteGroupSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(validation.data.id);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour supprimer ce groupe"
			);
		}

		// Récupérer le groupe pour vérifier le nom
		const existingGroup = await db.group.findUnique({
			where: { id: validation.data.id },
		});

		if (!existingGroup) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Ce groupe n'existe pas"
			);
		}

		// Vérifier que le nom saisi correspond au nom du groupe
		if (validation.data.confirmName !== existingGroup.name) {
			return createValidationErrorResponse(
				{
					confirmName: ["Le nom saisi ne correspond pas au nom du groupe"],
				},
				rawData,
				"Le nom saisi ne correspond pas au nom du groupe"
			);
		}

		const group = await db.group.delete({
			where: { id: validation.data.id },
		});

		revalidateTag("groups");
		revalidateTag(`groups:user:${session.user.id}`);
		revalidateTag(`group-${validation.data.id}`);

		return createSuccessResponse(
			group,
			`Le groupe ${group.name} a été supprimé avec succès`
		);
	} catch (error) {
		console.error("[DELETE_GROUP]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer le groupe"
		);
	}
}
