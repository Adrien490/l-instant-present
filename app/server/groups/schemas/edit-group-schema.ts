import { z } from "zod";

export const editGroupSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
	name: z
		.string()
		.min(3, "Le nom doit contenir au moins 3 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	description: z
		.string()
		.max(500, "La description ne peut pas dépasser 500 caractères")
		.optional()
		.nullable(),
	imageUrl: z
		.string()
		.url("L'URL de l'image n'est pas valide")
		.optional()
		.nullable(),
});

export type EditGroupParams = z.infer<typeof editGroupSchema>;

export default editGroupSchema;
