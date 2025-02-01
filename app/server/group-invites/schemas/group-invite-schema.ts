import { z } from "zod";

export const InviteStatus = {
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
	EXPIRED: "EXPIRED",
} as const;

export const groupInviteSchema = z.object({
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
	email: z.string().email({
		message: "L'adresse email n'est pas valide",
	}),
	expiresAt: z.date().optional(),
});

export type GroupInviteParams = z.infer<typeof groupInviteSchema>;

export default groupInviteSchema;
