import { z } from "zod";

export const getGroupMemberSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
	userId: z.string().uuid({
		message: "L'identifiant de l'utilisateur doit être un UUID valide",
	}),
});

export type GetGroupMemberParams = z.infer<typeof getGroupMemberSchema>;

export default getGroupMemberSchema;
