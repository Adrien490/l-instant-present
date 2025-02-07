import { z } from "zod";

const challengePeriodSchema = z
	.object({
		id: z
			.string()
			.uuid({
				message: "L'identifiant de la période doit être un UUID valide",
			})
			.optional()
			.nullable(),
		name: z
			.string()
			.min(3, "Le nom doit contenir au moins 3 caractères")
			.max(50, "Le nom ne peut pas dépasser 50 caractères"),
		startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
			message: "La date de début doit être une date valide",
		}),
		endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
			message: "La date de fin doit être une date valide",
		}),
		groupId: z.string().uuid({
			message: "L'identifiant du groupe doit être un UUID valide",
		}),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return start < end;
		},
		{
			message: "La date de fin doit être postérieure à la date de début",
			path: ["endDate"],
		}
	)
	.refine(
		(data) => {
			const start = new Date(data.startDate);
			return start >= new Date();
		},
		{
			message: "La date de début ne peut pas être dans le passé",
			path: ["startDate"],
		}
	);

export type ChallengePeriodParams = z.infer<typeof challengePeriodSchema>;

export default challengePeriodSchema;
