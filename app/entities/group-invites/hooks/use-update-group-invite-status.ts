"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupInvite } from "@prisma/client";
import { useActionState } from "react";
import updateGroupInviteStatus from "../actions/update-group-invite-status";
import updateGroupInviteStatusSchema from "../schemas/update-group-invite-status-schema";

export function useUpdateGroupInviteStatus() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupInvite, typeof updateGroupInviteStatusSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await updateGroupInviteStatus(previousState, formData);
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
