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
import sendGroupInviteSchema from "../schemas/send-group-invite-schema";

export default async function sendGroupInvite(
	_: ServerActionState<GroupInvite, typeof sendGroupInviteSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupInvite, typeof sendGroupInviteSchema>> {
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

		const validation = sendGroupInviteSchema.safeParse(rawData);

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

		if (session.user.email === rawData.email) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Vous ne pouvez pas vous inviter vous-même"
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

		const existingInvite = await db.groupInvite.findFirst({
			where: {
				groupId: validation.data.groupId,
				email: validation.data.email,
				status: "PENDING",
			},
		});

		if (existingInvite) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Une invitation est déjà en attente pour cette personne"
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
