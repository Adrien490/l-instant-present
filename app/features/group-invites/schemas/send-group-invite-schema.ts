import { GroupRole } from "@prisma/client";
import { z } from "zod";

const sendGroupInviteSchema = z.object({
	groupId: z.string().min(1, "L'ID du groupe est requis"),
	email: z.string().email("L'adresse email n'est pas valide"),
	role: z.nativeEnum(GroupRole, {
		required_error: "Le rôle est requis",
		invalid_type_error: "Le rôle n'est pas valide",
	}),
});

export default sendGroupInviteSchema;
