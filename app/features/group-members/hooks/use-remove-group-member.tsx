"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupMember } from "@prisma/client";
import { useActionState } from "react";
import removeGroupMember from "../actions/remove-group-member";
import removeGroupMemberSchema from "../schemas/remove-group-member-schema";

export function useRemoveGroupMember() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupMember, typeof removeGroupMemberSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await removeGroupMember(previousState, formData);
			} catch (error) {
				console.error("[USE_REMOVE_GROUP_MEMBER]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue lors du retrait du membre",
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
