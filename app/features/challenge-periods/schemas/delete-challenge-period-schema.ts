import { z } from "zod";

const deleteChallengePeriodSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant de la période doit être un UUID valide",
	}),
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type DeleteChallengePeriodParams = z.infer<
	typeof deleteChallengePeriodSchema
>;

export default deleteChallengePeriodSchema;
