import { GroupInviteStatus, GroupRole } from "@prisma/client";
import { z } from "zod";
export const groupInviteSchema = z.object({
	// Identifiant optionnel car il est généralement généré par la base de données
	id: z
		.string()
		.uuid({ message: "L'identifiant de l'invitation doit être un UUID valide" })
		.optional()
		.nullable(),
	// Identifiant du groupe ciblé
	groupId: z
		.string()
		.uuid({ message: "L'identifiant du groupe doit être un UUID valide" }),
	// Identifiant de l'expéditeur (l'utilisateur qui envoie l'invitation)
	senderId: z.string().uuid({
		message: "L'identifiant de l'expéditeur doit être un UUID valide",
	}),
	// Email destinataire de l'invitation
	email: z.string().email({ message: "L'email n'est pas valide" }),
	// Le statut de l'invitation : par défaut "PENDING"
	status: z.nativeEnum(GroupInviteStatus).default("PENDING"),
	// Date d'expiration de l'invitation (optionnel)
	expiresAt: z.string().optional().nullable(),
	// Rôle que recevra l'utilisateur s'il accepte l'invitation : par défaut "MEMBER"
	role: z.nativeEnum(GroupRole).default("MEMBER"),
});
export type GroupInviteSchemaParams = z.infer<typeof groupInviteSchema>;
