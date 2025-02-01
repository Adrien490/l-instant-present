"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupInvite } from "@prisma/client";
import { useActionState } from "react";
import createGroupInvite from "../actions/create-group-invite";
import groupInviteSchema from "../schemas/group-invite-schema";

export function useCreateGroupInvite() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupInvite, typeof groupInviteSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await createGroupInvite(previousState, formData);
			} catch (error) {
				console.error("[USE_CREATE_GROUP_INVITE]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue lors de l'envoi de l'invitation",
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
