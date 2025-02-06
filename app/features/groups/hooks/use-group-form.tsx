"use client";

import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Group } from "@prisma/client";
import { useActionState } from "react";
import createGroup from "../actions/create-group";
import editGroup from "../actions/edit-group";
import { GetGroupResponse } from "../queries/get-group";
import groupFormSchema from "../schemas/group-schema";

interface UseGroupFormProps {
	group?: GetGroupResponse | null;
}

export function useGroupForm({ group }: UseGroupFormProps = {}) {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Group, typeof groupFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				if (group) {
					return await editGroup(previousState, formData);
				}
				return await createGroup(previousState, formData);
			} catch (error) {
				console.error("[USE_GROUP_FORM]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
			data: group ?? undefined,
		}
	);

	return {
		state,
		dispatch,
		isPending,
		isEditing: !!group,
	};
}
