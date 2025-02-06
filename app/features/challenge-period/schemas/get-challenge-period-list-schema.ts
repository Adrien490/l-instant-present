import { z } from "zod";

export const SortOrder = z.enum(["asc", "desc"]);

const getChallengePeriodListSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
	search: z.string().optional(),
	take: z.number().int().positive().optional(),
	orderBy: z
		.object({
			createdAt: SortOrder,
			updatedAt: SortOrder,
			name: SortOrder,
			startDate: SortOrder,
			endDate: SortOrder,
		})
		.partial()
		.optional(),
});

export type GetChallengePeriodListParams = z.infer<
	typeof getChallengePeriodListSchema
>;

export default getChallengePeriodListSchema;
