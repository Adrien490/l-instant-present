import { z } from "zod";
import { InviteStatus } from "./group-invite-schema";

export const updateGroupInviteSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant de l'invitation doit être un UUID valide",
	}),
	status: z.enum([
		InviteStatus.PENDING,
		InviteStatus.ACCEPTED,
		InviteStatus.REJECTED,
		InviteStatus.EXPIRED,
	]),
});

export type UpdateGroupInviteParams = z.infer<typeof updateGroupInviteSchema>;

export default updateGroupInviteSchema;
