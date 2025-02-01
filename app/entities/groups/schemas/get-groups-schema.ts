import { z } from "zod";

export const getGroupsSchema = z.object({
	search: z.string().optional(),
});

export type GetGroupsParams = z.infer<typeof getGroupsSchema>;

export default getGroupsSchema;
