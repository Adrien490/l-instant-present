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

// Liste étendue des types MIME d'images supportés
const ALLOWED_FILE_TYPES = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/svg+xml",
	"image/bmp",
	"image/tiff",
	"image/x-icon",
]);

// Liste des extensions supportées (en minuscules)
const ALLOWED_FILE_EXTENSIONS = new Set([
	".jpg",
	".jpeg",
	".png",
	".gif",
	".webp",
	".svg",
	".bmp",
	".tiff",
	".tif",
	".ico",
]);

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

function isValidImageFile(file: File): boolean {
	// Vérification du type MIME
	const mimeTypeValid = ALLOWED_FILE_TYPES.has(file.type.toLowerCase());

	// Vérification de l'extension
	const extension = "." + file.name.split(".").pop()?.toLowerCase();
	const extensionValid = ALLOWED_FILE_EXTENSIONS.has(extension);

	return mimeTypeValid || extensionValid;
}

function sanitizeFileName(fileName: string): string {
	// Convertit en minuscules et remplace les caractères spéciaux
	return fileName
		.toLowerCase()
		.replace(/[^a-z0-9.-]/g, "-")
		.replace(/--+/g, "-");
}

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

		// Vérification du format
		if (!isValidImageFile(file)) {
			console.error("[UPLOAD_GROUP_IMAGE] Invalid image format", {
				fileName: file.name,
				fileType: file.type,
			});
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Format d'image non supporté. Formats acceptés : JPG, JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO"
			);
		}

		try {
			// Création d'un nouveau fichier avec un nom normalisé
			const sanitizedFileName = sanitizeFileName(file.name);
			const newFile = new File([file], sanitizedFileName, {
				type: file.type,
			});

			console.log("[UPLOAD_GROUP_IMAGE] Starting upload", {
				originalFileName: file.name,
				sanitizedFileName,
				fileType: file.type,
				fileSize: file.size,
			});

			const response = await utapi.uploadFiles([newFile]);

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
