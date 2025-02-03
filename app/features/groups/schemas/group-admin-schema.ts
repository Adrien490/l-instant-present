import { z } from "zod";

export const groupAdminSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GroupAdminParams = z.infer<typeof groupAdminSchema>;

export default groupAdminSchema;
