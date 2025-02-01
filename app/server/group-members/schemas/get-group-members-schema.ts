import { z } from "zod";

export const getGroupMembersSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GetGroupMembersParams = z.infer<typeof getGroupMembersSchema>;

export default getGroupMembersSchema;
