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
import updateGroupInviteSchema from "../schemas/update-group-invite-status-schema";

export default async function updateGroupInviteStatus(
	_: ServerActionState<GroupInvite, typeof updateGroupInviteSchema> | null,
	formData: FormData
): Promise<ServerActionState<GroupInvite, typeof updateGroupInviteSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour répondre à l'invitation"
			);
		}

		const rawData = {
			id: formData.get("id")?.toString() || "",
			status: formData.get("status")?.toString() || "",
		};

		const validation = updateGroupInviteSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const existingInvite = await db.groupInvite.findUnique({
			where: { id: validation.data.id },
			select: {
				groupId: true,
				email: true,
				role: true,
			},
		});

		if (!existingInvite) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'invitation n'existe pas"
			);
		}

		if (validation.data.status === "ACCEPTED") {
			const existingMember = await db.groupMember.findUnique({
				where: {
					userId_groupId: {
						userId: session.user.id,
						groupId: existingInvite.groupId,
					},
				},
			});

			if (!existingMember) {
				await db.groupMember.create({
					data: {
						userId: session.user.id,
						groupId: existingInvite.groupId,
						role: existingInvite.role,
					},
				});
			}
		}

		const invite = await db.groupInvite.update({
			where: { id: validation.data.id },
			data: { status: validation.data.status },
		});

		revalidateTag(`group-${invite.groupId}`);
		revalidateTag(`group-invites-${invite.groupId}`);
		revalidateTag("groups:list");
		revalidateTag(`groups:user:${session.user.id}`);
		revalidateTag("groups:search:all");

		return createSuccessResponse(
			invite,
			"L'invitation a été mise à jour avec succès"
		);
	} catch (error) {
		console.error("[UPDATE_GROUP_INVITE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour l'invitation"
		);
	}
}
