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
import addGroupMemberSchema from "../schemas/add-group-member-schema";

export default async function addGroupMember(
	_: ServerActionState<GroupMember, typeof addGroupMemberSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupMember, typeof addGroupMemberSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour ajouter un membre"
			);
		}

		const rawData = {
			groupId: formData.get("groupId")?.toString() || "",
			userId: formData.get("userId")?.toString() || "",
			role: formData.get("role")?.toString() || "MEMBER",
		};

		const validation = addGroupMemberSchema.safeParse(rawData);

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
				"Vous n'avez pas les droits pour ajouter un membre"
			);
		}

		const member = await db.groupMember.create({
			data: validation.data,
		});

		revalidateTag(`group-${validation.data.groupId}`);
		revalidateTag(`group-members-${validation.data.groupId}`);

		return createSuccessResponse(member, "Le membre a été ajouté avec succès");
	} catch (error) {
		console.error("[ADD_GROUP_MEMBER]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible d'ajouter le membre"
		);
	}
}
