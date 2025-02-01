import { z } from "zod";

export const getGroupSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GetGroupParams = z.infer<typeof getGroupSchema>;

export default getGroupSchema;
