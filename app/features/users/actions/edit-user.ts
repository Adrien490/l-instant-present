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
import { User } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import userFormSchema from "../schemas/user-form-schema";

export default async function editUser(
	_: ServerActionState<User, typeof userFormSchema>,
	formData: FormData
): Promise<ServerActionState<User, typeof userFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier votre profil"
			);
		}

		const userId = formData.get("id")?.toString();
		if (!userId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'identifiant de l'utilisateur est manquant"
			);
		}

		// Vérifier que l'utilisateur modifie son propre profil
		if (session.user.id !== userId) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous ne pouvez pas modifier le profil d'un autre utilisateur"
			);
		}

		const rawData = {
			id: userId,
			name: formData.get("name")?.toString() || "",
			image: formData.get("image")?.toString() || null,
		};

		const validation = userFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const user = await db.user.update({
			where: { id: userId },
			data: {
				name: validation.data.name,
				image: validation.data.image,
				updatedAt: new Date(),
			},
		});

		// Revalidation de tous les caches concernés
		revalidateTag("users"); // Cache global des utilisateurs
		revalidateTag("users:list"); // Liste des utilisateurs
		revalidateTag(`users:search:all`); // Recherche globale
		revalidateTag(`user:${userId}`); // Cache spécifique à l'utilisateur

		return createSuccessResponse(
			user,
			"Votre profil a été modifié avec succès"
		);
	} catch (error) {
		console.error("[EDIT_USER]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier votre profil"
		);
	}
}
