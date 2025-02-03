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
import {
	GroupInvite,
	GroupInviteStatus,
	NotificationType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import sendPushNotifications from "../../push-notifications/helpers/send-push-notifications";
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

		try {
			const result = await db.$transaction(async (tx) => {
				const existingInvite = await tx.groupInvite.findUnique({
					where: { id: validation.data.id },
					select: {
						id: true,
						groupId: true,
						email: true,
						role: true,
						status: true,
						group: {
							select: {
								name: true,
								members: {
									select: {
										userId: true,
									},
								},
							},
						},
					},
				});

				if (!existingInvite) {
					throw new Error("L'invitation n'existe pas");
				}

				if (existingInvite.status !== GroupInviteStatus.PENDING) {
					throw new Error("Cette invitation a déjà été traitée");
				}

				if (existingInvite.email !== session.user.email) {
					throw new Error("Cette invitation ne vous est pas destinée");
				}

				if (validation.data.status === GroupInviteStatus.ACCEPTED) {
					const existingMember = await tx.groupMember.findUnique({
						where: {
							userId_groupId: {
								userId: session.user.id,
								groupId: existingInvite.groupId,
							},
						},
					});

					if (existingMember) {
						throw new Error(
							`Vous êtes déjà membre du groupe "${existingInvite.group.name}"`
						);
					}

					await tx.groupMember.create({
						data: {
							userId: session.user.id,
							groupId: existingInvite.groupId,
							role: existingInvite.role,
						},
					});

					// Récupérer les informations de l'utilisateur qui rejoint
					const joiningUser = await tx.user.findUnique({
						where: { id: session.user.id },
						select: { name: true },
					});

					// Envoyer une notification à tous les membres du groupe
					const memberIds = existingInvite.group.members
						.map((member) => member.userId)
						.filter((id) => id !== session.user.id); // Exclure l'utilisateur qui rejoint

					if (memberIds.length > 0) {
						await sendPushNotifications(memberIds, {
							title: "Nouveau membre",
							body: `${joiningUser?.name} a rejoint le groupe "${existingInvite.group.name}"`,
							icon: "/icon.png",
							badge: "/badge.png",
							data: {
								url: `/app/groups/${existingInvite.groupId}/members`,
								type: NotificationType.MEMBER_JOINED,
							},
						});
					}
				}

				const updatedInvite = await tx.groupInvite.update({
					where: { id: validation.data.id },
					data: { status: validation.data.status },
				});

				return {
					invite: updatedInvite,
					groupName: existingInvite.group.name,
				};
			});

			// Revalidation du cache
			revalidateTag(`group-${result.invite.groupId}`);
			revalidateTag(`group-invites-${result.invite.groupId}`);
			revalidateTag("groups:list");
			revalidateTag(`groups:user:${session.user.id}`);
			revalidateTag("groups:search:all");
			revalidateTag(`group-members-${result.invite.groupId}`);
			revalidateTag("invites:list");
			revalidateTag(`invites:user:${session.user.id}`);

			const successMessage =
				validation.data.status === GroupInviteStatus.ACCEPTED
					? `Vous avez rejoint le groupe "${result.groupName}"`
					: `Vous avez refusé l'invitation au groupe "${result.groupName}"`;

			return createSuccessResponse(result.invite, successMessage);
		} catch (error) {
			if (error instanceof Error) {
				return createErrorResponse(ServerActionStatus.ERROR, error.message);
			}
			throw error;
		}
	} catch (error) {
		console.error("[UPDATE_GROUP_INVITE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur inattendue est survenue"
		);
	}
}
