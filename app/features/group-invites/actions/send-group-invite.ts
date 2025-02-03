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
import webpush from "web-push";
import { isGroupAdmin } from "../../groups/queries/is-group-admin";
import sendGroupInviteSchema from "../schemas/send-group-invite-schema";

// Configuration de web-push avec vos clés VAPID
webpush.setVapidDetails(
	"mailto:your-email@example.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

async function sendPushNotification(
	userId: string,
	group: { name: string; id: string },
	inviteId: string
) {
	try {
		// Récupérer tous les appareils de l'utilisateur
		const pushDevices = await db.pushDevice.findMany({
			where: { userId },
		});

		// Pour chaque appareil, envoyer une notification
		const notificationPayload = {
			title: "Nouvelle invitation",
			body: `Vous avez été invité(e) à rejoindre le groupe "${group.name}"`,
			icon: "/icon.png",
			badge: "/badge.png",
			data: {
				url: `/app/invites/${inviteId}`,
				type: NotificationType.GROUP_INVITE,
				id: inviteId,
				groupId: group.id,
				isLoggedOut: false,
			},
		};

		await Promise.all(
			pushDevices.map(async (device) => {
				try {
					await webpush.sendNotification(
						{
							endpoint: device.endpoint,
							keys: {
								p256dh: device.p256dh,
								auth: device.auth,
							},
						},
						JSON.stringify(notificationPayload)
					);

					// Mettre à jour la date de dernière utilisation
					await db.pushDevice.update({
						where: { id: device.id },
						data: { lastUsedAt: new Date() },
					});
				} catch (error) {
					console.error(
						`[PUSH_NOTIFICATION] Failed to send to device ${device.id}:`,
						error
					);
					// Si l'erreur indique que l'abonnement n'est plus valide, supprimer l'appareil
					if (error instanceof Error && error.message.includes("expired")) {
						await db.pushDevice.delete({ where: { id: device.id } });
					}
				}
			})
		);

		// Créer une notification en base de données
		await db.notification.create({
			data: {
				userId,
				type: NotificationType.GROUP_INVITE,
				title: notificationPayload.title,
				body: notificationPayload.body,
				data: { groupId: group.id },
			},
		});
	} catch (error) {
		console.error("[PUSH_NOTIFICATION] Failed to send:", error);
	}
}

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
			role: formData.get("role")?.toString() || "",
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

		if (session.user.email === validation.data.email) {
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
				status: {
					in: ["PENDING", "EXPIRED"],
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Si une invitation existe et qu'elle est expirée, on la met à jour
		if (existingInvite?.status === GroupInviteStatus.EXPIRED) {
			const invite = await db.groupInvite.update({
				where: { id: existingInvite.id },
				data: {
					role: validation.data.role,
					senderId: session.user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
					status: GroupInviteStatus.PENDING,
				},
			});

			revalidateTag(`group-${validation.data.groupId}`);
			revalidateTag(`group-invites-${validation.data.groupId}`);

			return createSuccessResponse(
				invite,
				"L'invitation a été renouvelée avec succès"
			);
		}

		// Si une invitation en attente existe déjà
		if (existingInvite?.status === GroupInviteStatus.PENDING) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Une invitation est déjà en attente pour cette personne"
			);
		}

		const invite = await db.groupInvite.create({
			data: {
				groupId: validation.data.groupId,
				email: validation.data.email,
				role: validation.data.role,
				senderId: session.user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				status: GroupInviteStatus.PENDING,
			},
			include: {
				group: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		// Envoyer la notification push
		await sendPushNotification(existingUser.id, invite.group, invite.id);

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
