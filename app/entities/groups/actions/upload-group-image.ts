"use server";

import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/types/server-action";
import { UTApi } from "uploadthing/server";
import uploadGroupImageSchema from "../schemas/upload-group-image-schema";

const utapi = new UTApi();

export async function uploadGroupImage(
	_: ServerActionState<
		{ url: string | null },
		typeof uploadGroupImageSchema
	> | null,
	formData: FormData
): Promise<
	ServerActionState<{ url: string | null }, typeof uploadGroupImageSchema>
> {
	try {
		const file = formData.get("imageUrl");
		let imageUrl = null;

		if (file && file instanceof File) {
			// Vérification du type de fichier
			if (!file.type.startsWith("image/")) {
				return createErrorResponse(
					ServerActionStatus.ERROR,
					"Le fichier doit être une image"
				);
			}

			// Vérification de la taille (4MB max)
			if (file.size > 4 * 1024 * 1024) {
				return createErrorResponse(
					ServerActionStatus.ERROR,
					"L'image ne doit pas dépasser 4MB"
				);
			}

			try {
				const response = await utapi.uploadFiles([file]);

				if (!response?.[0]?.data?.url) {
					return createErrorResponse(
						ServerActionStatus.ERROR,
						"Erreur lors de l'upload de l'image"
					);
				}

				imageUrl = response[0].data.url;
			} catch (error) {
				console.error("[UPLOAD_GROUP_IMAGE]", error);
				return createErrorResponse(
					ServerActionStatus.ERROR,
					"Une erreur est survenue lors de l'upload de l'image"
				);
			}
		}

		return createSuccessResponse(
			{ url: imageUrl },
			imageUrl ? "Image uploadée avec succès" : "Aucune image à uploader"
		);
	} catch (error) {
		console.error("[UPLOAD_GROUP_IMAGE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de l'upload de l'image"
		);
	}
}
