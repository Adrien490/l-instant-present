import { GroupInviteStatus } from "@prisma/client";
import { z } from "zod";

export const updateGroupInviteStatusSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant de l'invitation doit être un UUID valide",
	}),
	status: z.nativeEnum(GroupInviteStatus),
});

export type UpdateGroupInviteStatusParams = z.infer<
	typeof updateGroupInviteStatusSchema
>;

export default updateGroupInviteStatusSchema;
