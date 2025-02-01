"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupMember } from "@prisma/client";
import { useActionState } from "react";
import updateGroupMember from "../actions/update-group-member";
import updateGroupMemberSchema from "../schemas/update-group-member-schema";

export function useUpdateGroupMember() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupMember, typeof updateGroupMemberSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await updateGroupMember(previousState, formData);
			} catch (error) {
				console.error("[USE_UPDATE_GROUP_MEMBER]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue lors de la modification du membre",
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
