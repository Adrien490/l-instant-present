import { z } from "zod";

const getChallengePeriodSchema = z.object({
	id: z.string().uuid({
		message: "L'identifiant de la période doit être un UUID valide",
	}),
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
});

export type GetChallengePeriodParams = z.infer<typeof getChallengePeriodSchema>;

export default getChallengePeriodSchema;
