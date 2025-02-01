"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Group } from "@prisma/client";
import { useActionState } from "react";
import deleteGroup from "../actions/delete-group";
import deleteGroupSchema from "../schemas/delete-group-schema";

export function useGroupDelete() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Group, typeof deleteGroupSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await deleteGroup(previousState, formData);
			} catch (error) {
				console.error("[USE_GROUP_DELETE]", error);
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
