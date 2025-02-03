import { z } from "zod";

const deleteGroupFormSchema = z.object({
	id: z.string(),
	confirmName: z
		.string()
		.min(1, "Veuillez saisir le nom du groupe pour confirmer la suppression")
		.refine(
			(value) => value === value.trim(),
			"Le nom ne doit pas contenir d'espaces au début ou à la fin"
		),
});

export default deleteGroupFormSchema;
