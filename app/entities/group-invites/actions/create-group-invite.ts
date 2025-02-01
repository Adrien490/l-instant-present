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
import { GroupInvite } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { isGroupAdmin } from "../../groups/queries/is-group-admin";
import groupInviteSchema from "../schemas/group-invite-schema";

export default async function createGroupInvite(
	_: ServerActionState<GroupInvite, typeof groupInviteSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupInvite, typeof groupInviteSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour envoyer une invitation"
			);
		}

		const rawData = {
			groupId: formData.get("groupId")?.toString() || "",
			email: formData.get("email")?.toString() || "",
			expiresAt: formData.get("expiresAt")
				? new Date(formData.get("expiresAt")?.toString() || "")
				: undefined,
		};

		const validation = groupInviteSchema.safeParse(rawData);

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
				"Vous n'avez pas les droits pour envoyer une invitation"
			);
		}

		const invite = await db.groupInvite.create({
			data: {
				...validation.data,
				senderId: session.user.id,
			},
		});

		revalidateTag(`group-${validation.data.groupId}`);
		revalidateTag(`group-invites-${validation.data.groupId}`);

		return createSuccessResponse(
			invite,
			"L'invitation a été envoyée avec succès"
		);
	} catch (error) {
		console.error("[CREATE_GROUP_INVITE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible d'envoyer l'invitation"
		);
	}
}
