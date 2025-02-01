import { z } from "zod";

export const getGroupInvitesSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GetGroupInvitesParams = z.infer<typeof getGroupInvitesSchema>;

export default getGroupInvitesSchema;
