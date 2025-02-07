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
			.string({
				required_error: "Le nom est requis",
				invalid_type_error: "Le nom doit être une chaîne de caractères",
			})
			.min(3, "Le nom doit contenir au moins 3 caractères")
			.max(50, "Le nom ne peut pas dépasser 50 caractères"),
		startDate: z
			.string({
				required_error: "La date de début est requise",
				invalid_type_error: "La date de début doit être une date valide",
			})
			.refine((date) => !isNaN(Date.parse(date)), {
				message: "La date de début doit être une date valide",
			}),
		endDate: z
			.string({
				required_error: "La date de fin est requise",
				invalid_type_error: "La date de fin doit être une date valide",
			})
			.refine((date) => !isNaN(Date.parse(date)), {
				message: "La date de fin doit être une date valide",
			}),
		groupId: z
			.string({
				required_error: "L'identifiant du groupe est requis",
				invalid_type_error:
					"L'identifiant du groupe doit être une chaîne de caractères",
			})
			.uuid({
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
	);

export type ChallengePeriodParams = z.infer<typeof challengePeriodSchema>;

export default challengePeriodSchema;
