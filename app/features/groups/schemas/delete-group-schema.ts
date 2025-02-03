import { z } from "zod";

const groupDeleteSchema = z.object({
	id: z.string(),
	confirmName: z
		.string()
		.min(1, "Veuillez saisir le nom du groupe pour confirmer la suppression"),
});

export default groupDeleteSchema;
