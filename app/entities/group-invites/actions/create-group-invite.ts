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
import groupInviteFormSchema from "../schemas/group-invite-form-schema";

export async function createGroupInvite(
	_: ServerActionState<GroupInvite, typeof groupInviteFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupInvite, typeof groupInviteFormSchema>> {
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
		};

		const validation = groupInviteFormSchema.safeParse(rawData);

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

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await db.user.findUnique({
			where: { email: validation.data.email },
			select: { id: true },
		});

		if (!existingUser) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Cette adresse email n'est pas associée à un compte"
			);
		}

		// Vérifier si l'utilisateur est déjà membre du groupe
		const existingMember = await db.groupMember.findUnique({
			where: {
				userId_groupId: {
					userId: existingUser.id,
					groupId: validation.data.groupId,
				},
			},
		});

		if (existingMember) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Cette personne est déjà membre du groupe"
			);
		}

		const invite = await db.groupInvite.create({
			data: {
				...validation.data,
				senderId: session.user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
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
