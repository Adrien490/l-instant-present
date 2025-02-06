import { z } from "zod";

export const SortOrder = z.enum(["asc", "desc"]);

export const getGroupListSchema = z.object({
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

export type GetGroupListParams = z.infer<typeof getGroupListSchema>;

export default getGroupListSchema;
