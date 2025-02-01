"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupInvite } from "@prisma/client";
import { useActionState } from "react";
import { createGroupInvite } from "../actions/create-group-invite";
import groupInviteFormSchema from "../schemas/group-invite-form-schema";

export function useGroupInviteForm() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupInvite, typeof groupInviteFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await createGroupInvite(previousState, formData);
			} catch (error) {
				console.error("[USE_GROUP_INVITE_FORM]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
			data: undefined,
		}
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
