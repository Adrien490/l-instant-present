"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { GroupMember } from "@prisma/client";
import { useActionState } from "react";
import addGroupMember from "../actions/add-group-member";
import addGroupMemberSchema from "../schemas/add-group-member-schema";

export function useAddGroupMember() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<GroupMember, typeof addGroupMemberSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await addGroupMember(previousState, formData);
			} catch (error) {
				console.error("[USE_ADD_GROUP_MEMBER]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue lors de l'ajout du membre",
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
