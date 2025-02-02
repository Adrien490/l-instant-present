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

const ALLOWED_FILE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

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

		if (!file) {
			console.log("[UPLOAD_GROUP_IMAGE] No file provided");
			return createSuccessResponse({ url: null }, "Aucune image à uploader");
		}

		if (!(file instanceof File)) {
			console.error("[UPLOAD_GROUP_IMAGE] Invalid file type", {
				fileType: typeof file,
			});
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Le fichier fourni n'est pas valide"
			);
		}

		// Vérification détaillée du type de fichier
		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			console.error("[UPLOAD_GROUP_IMAGE] Invalid image type", {
				fileType: file.type,
				allowedTypes: ALLOWED_FILE_TYPES,
			});
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Le format d'image n'est pas supporté. Formats acceptés : JPG, PNG, GIF, WebP"
			);
		}

		// Vérification de la taille
		if (file.size > MAX_FILE_SIZE) {
			console.error("[UPLOAD_GROUP_IMAGE] File too large", {
				fileSize: file.size,
				maxSize: MAX_FILE_SIZE,
			});
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'image ne doit pas dépasser 4MB"
			);
		}

		// Vérification que le fichier n'est pas vide
		if (file.size === 0) {
			console.error("[UPLOAD_GROUP_IMAGE] Empty file");
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Le fichier image est vide"
			);
		}

		try {
			console.log("[UPLOAD_GROUP_IMAGE] Starting upload", {
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
			});

			const response = await utapi.uploadFiles([file]);

			if (!response?.[0]) {
				console.error("[UPLOAD_GROUP_IMAGE] No response from upload");
				return createErrorResponse(
					ServerActionStatus.ERROR,
					"Erreur lors de l'upload de l'image"
				);
			}

			if (!response[0].data?.url) {
				console.error("[UPLOAD_GROUP_IMAGE] No URL in response", { response });
				return createErrorResponse(
					ServerActionStatus.ERROR,
					"Erreur lors de la récupération de l'URL de l'image"
				);
			}

			imageUrl = response[0].data.url;
			console.log("[UPLOAD_GROUP_IMAGE] Upload successful", { imageUrl });
		} catch (error) {
			console.error("[UPLOAD_GROUP_IMAGE] Upload error", error);
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Une erreur est survenue lors de l'upload de l'image. Veuillez réessayer."
			);
		}

		return createSuccessResponse(
			{ url: imageUrl },
			"Image uploadée avec succès"
		);
	} catch (error) {
		console.error("[UPLOAD_GROUP_IMAGE] Unexpected error", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur inattendue est survenue. Veuillez réessayer."
		);
	}
}
