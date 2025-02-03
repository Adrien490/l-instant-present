import { z } from "zod";

export const getGroupsSchema = z.object({
	search: z.string().optional(),
	take: z.number().int().positive().optional(),
});

export type GetGroupsParams = z.infer<typeof getGroupsSchema>;

export default getGroupsSchema;
