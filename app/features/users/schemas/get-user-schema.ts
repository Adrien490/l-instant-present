import { z } from "zod";

export const getUserSchema = z.object({
	id: z.string({
		required_error: "L'identifiant de l'utilisateur est requis",
		invalid_type_error:
			"L'identifiant de l'utilisateur doit être une chaîne de caractères",
	}),
});

export type GetUserParams = z.infer<typeof getUserSchema>;

export default getUserSchema;
