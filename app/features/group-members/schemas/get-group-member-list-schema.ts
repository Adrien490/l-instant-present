import { z } from "zod";

export const getGroupMemberListSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GetGroupMemberListParams = z.infer<typeof getGroupMemberListSchema>;

export default getGroupMemberListSchema;
