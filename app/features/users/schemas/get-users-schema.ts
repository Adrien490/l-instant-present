import { z } from "zod";

export const getUsersSchema = z.object({
	search: z.string().optional(),
	take: z.number().min(1).max(100).optional(),
	orderBy: z
		.object({
			createdAt: z.enum(["asc", "desc"]).optional(),
			name: z.enum(["asc", "desc"]).optional(),
			email: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
});

export type GetUsersParams = z.infer<typeof getUsersSchema>;

export default getUsersSchema;
