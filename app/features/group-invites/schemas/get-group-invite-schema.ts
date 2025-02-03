import { z } from "zod";

export const getGroupInviteSchema = z.object({
	inviteId: z
		.string({
			required_error: "L'identifiant de l'invitation est requis",
			invalid_type_error:
				"L'identifiant de l'invitation doit être une chaîne de caractères",
		})
		.uuid({
			message: "L'identifiant de l'invitation n'est pas valide",
		}),
});

export type GetGroupInviteParams = z.infer<typeof getGroupInviteSchema>;

export default getGroupInviteSchema;
