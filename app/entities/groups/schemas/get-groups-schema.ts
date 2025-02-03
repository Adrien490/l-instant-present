import { z } from "zod";

export const SortOrder = z.enum(["asc", "desc"]);

export const getGroupsSchema = z.object({
	search: z.string().optional(),
	take: z.number().int().positive().optional(),
	orderBy: z
		.object({
			createdAt: SortOrder,
			updatedAt: SortOrder,
			name: SortOrder,
		})
		.partial()
		.optional(),
});

export type GetGroupsParams = z.infer<typeof getGroupsSchema>;

export default getGroupsSchema;
