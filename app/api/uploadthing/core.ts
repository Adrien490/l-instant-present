import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
	createUploadthing,
	UploadThingError,
	type FileRouter,
} from "uploadthing/server";

const f = createUploadthing();

const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
};

// FileRouter pour vos fichiers uploadés
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	groupImage: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "4MB",
			maxFileCount: 1,
			contentDisposition: "inline",
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			const user = await getUser();

			if (!user)
				throw new UploadThingError(
					"Vous devez être connecté pour télécharger une image"
				);

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log(
				"Upload d'image de groupe complété pour l'utilisateur:",
				metadata.userId
			);
			console.log("URL du fichier:", file.url);

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { url: file.url };
		}),

	userAvatar: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
			contentDisposition: "inline",
		},
	})
		.middleware(async () => {
			const user = await getUser();

			if (!user)
				throw new UploadThingError(
					"Vous devez être connecté pour télécharger une photo de profil"
				);

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log(
				"Upload de photo de profil complété pour l'utilisateur:",
				metadata.userId
			);
			console.log("URL du fichier:", file.url);

			return { url: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
