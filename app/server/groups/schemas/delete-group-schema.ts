import { z } from "zod";

export const deleteGroupSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type DeleteGroupParams = z.infer<typeof deleteGroupSchema>;

export default deleteGroupSchema;
