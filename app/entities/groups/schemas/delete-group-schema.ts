import { z } from "zod";

const deleteGroupSchema = z.object({
	id: z.string(),
	confirmName: z
		.string()
		.min(1, "Veuillez saisir le nom du groupe pour confirmer la suppression"),
});

export default deleteGroupSchema;
