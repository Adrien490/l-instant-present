import { GroupRole } from "@prisma/client";
import { z } from "zod";

export const addGroupMemberSchema = z.object({
	userId: z.string().uuid({
		message: "L'identifiant de l'utilisateur doit être un UUID valide",
	}),
	groupId: z.string().uuid({
		message: "L'identifiant du groupe doit être un UUID valide",
	}),
	role: z
		.nativeEnum(GroupRole, {
			required_error: "Le rôle est requis",
			invalid_type_error: "Rôle invalide",
		})
		.default(GroupRole.MEMBER),
});

export type AddGroupMemberParams = z.infer<typeof addGroupMemberSchema>;

export default addGroupMemberSchema;
