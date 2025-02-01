"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { GroupMember } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { isGroupAdmin } from "../../groups/queries/is-group-admin";
import updateGroupMemberSchema from "../schemas/update-group-member-schema";

export default async function updateGroupMember(
	_: ServerActionState<GroupMember, typeof updateGroupMemberSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupMember, typeof updateGroupMemberSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un membre"
			);
		}

		const rawData = {
			groupId: formData.get("groupId")?.toString() || "",
			userId: formData.get("userId")?.toString() || "",
			role: formData.get("role")?.toString() || "MEMBER",
		};

		const validation = updateGroupMemberSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(validation.data.groupId);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour modifier un membre"
			);
		}

		const member = await db.groupMember.update({
			where: {
				userId_groupId: {
					userId: validation.data.userId,
					groupId: validation.data.groupId,
				},
			},
			data: {
				role: validation.data.role,
			},
		});

		revalidateTag(`group-${validation.data.groupId}`);
		revalidateTag(`group-members-${validation.data.groupId}`);

		return createSuccessResponse(member, "Le membre a été modifié avec succès");
	} catch (error) {
		console.error("[UPDATE_GROUP_MEMBER]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le membre"
		);
	}
}
