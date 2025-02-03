import { GroupInviteStatus } from "@prisma/client";
import { z } from "zod";

export const getGroupInvitesSchema = z.object({
	type: z.enum(["sent", "received"]),
	status: z.nativeEnum(GroupInviteStatus).optional(),
	take: z.number().optional(),
});

export type GetGroupInvitesParams = z.infer<typeof getGroupInvitesSchema>;

export default getGroupInvitesSchema;
