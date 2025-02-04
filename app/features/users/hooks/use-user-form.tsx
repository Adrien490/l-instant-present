"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { User } from "@prisma/client";
import { useActionState } from "react";
import editUser from "../actions/edit-user";
import { GetUserResponse } from "../queries/get-user";
import userFormSchema from "../schemas/user-form-schema";

interface UseUserFormProps {
	user?: GetUserResponse;
}

export default function useUserForm({ user }: UseUserFormProps = {}) {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<User, typeof userFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				// Contrairement au groupe, on ne gère que l'édition car la création se fait via l'authentification
				return await editUser(previousState, formData);
			} catch (error) {
				console.error("[USE_USER_FORM]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
			data: user,
		}
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
