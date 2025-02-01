"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/types/server-action";
import { GroupMember } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { isGroupAdmin } from "../../groups/queries/is-group-admin";
import removeGroupMemberSchema from "../schemas/remove-group-member-schema";

export default async function removeGroupMember(
	_: ServerActionState<GroupMember, typeof removeGroupMemberSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupMember, typeof removeGroupMemberSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour retirer un membre"
			);
		}

		const rawData = {
			groupId: formData.get("groupId")?.toString() || "",
			userId: formData.get("userId")?.toString() || "",
		};

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(rawData.groupId);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour retirer un membre"
			);
		}

		const member = await db.groupMember.delete({
			where: {
				userId_groupId: {
					userId: rawData.userId,
					groupId: rawData.groupId,
				},
			},
		});

		revalidateTag(`group-${rawData.groupId}`);
		revalidateTag(`group-members-${rawData.groupId}`);

		return createSuccessResponse(member, "Le membre a été retiré avec succès");
	} catch (error) {
		console.error("[REMOVE_GROUP_MEMBER]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de retirer le membre"
		);
	}
}
