import { z } from "zod";

const userFormSchema = z.object({
	id: z.string().min(1, "L'identifiant est requis"),
	name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	image: z.string().nullable(),
});

export default userFormSchema;
