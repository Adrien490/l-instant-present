import { z } from "zod";

export default z.object({
	groupId: z.string().min(1, "Veuillez sélectionner un groupe"),
	email: z
		.string()
		.min(1, "L'adresse email est requise")
		.email("L'adresse email n'est pas valide"),
});
