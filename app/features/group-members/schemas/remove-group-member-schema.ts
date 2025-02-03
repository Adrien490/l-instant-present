import { z } from "zod";

export const removeGroupMemberSchema = z.object({
	userId: z.string().uuid({
		message: "L'identifiant de l'utilisateur doit être un UUID valide",
	}),
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type RemoveGroupMemberParams = z.infer<typeof removeGroupMemberSchema>;

export default removeGroupMemberSchema;
