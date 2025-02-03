"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Group } from "@prisma/client";
import { useActionState } from "react";
import deleteGroup from "../actions/delete-group";
import deleteGroupFormSchema from "../schemas/delete-group-form-schema";

export function useDeleteGroup() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Group, typeof deleteGroupFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await deleteGroup(previousState, formData);
			} catch (error) {
				console.error("[USE_DELETE_GROUP]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue lors de la suppression",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
