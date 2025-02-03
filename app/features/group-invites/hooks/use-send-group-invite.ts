"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupInvite } from "@prisma/client";
import { useActionState } from "react";
import sendGroupInvite from "../actions/send-group-invite";
import groupInviteFormSchema from "../schemas/send-group-invite-schema";

export function useSendGroupInvite() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupInvite, typeof groupInviteFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await sendGroupInvite(previousState, formData);
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
