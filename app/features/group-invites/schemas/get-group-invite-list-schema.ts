import { GroupInviteStatus } from "@prisma/client";
import { z } from "zod";

export const getGroupInviteListSchema = z.object({
	filter: z.enum(["sent", "received"]),
	status: z.nativeEnum(GroupInviteStatus).optional(),
	search: z.string().optional(),
	take: z.number().optional(),
});

export type GetGroupInviteListParams = z.infer<typeof getGroupInviteListSchema>;

export default getGroupInviteListSchema;
