"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupInvite } from "@prisma/client";
import { useActionState } from "react";
import updateGroupInvite from "../actions/update-group-invite";
import updateGroupInviteSchema from "../schemas/update-group-invite-schema";

export function useUpdateGroupInvite() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupInvite, typeof updateGroupInviteSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await updateGroupInvite(previousState, formData);
			} catch (error) {
				console.error("[USE_UPDATE_GROUP_INVITE]", error);
				return {
					status: ServerActionStatus.ERROR,
					message:
						"Une erreur est survenue lors de la mise à jour de l'invitation",
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
