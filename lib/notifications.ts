"use server";

import { NotificationType } from "@prisma/client";
import webpush from "web-push";
import prisma from "./db";

webpush.setVapidDetails(
	"mailto:your@email.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

interface PushSubscriptionKeys {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

// Enregistrement d'un nouvel appareil
export async function registerDevice(
	subscription: PushSubscriptionKeys,
	userAgent?: string
) {
	return prisma.pushDevice.upsert({
		where: {
			endpoint: subscription.endpoint,
		},
		create: {
			userId: "user-id",
			endpoint: subscription.endpoint,
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth,
			userAgent,
		},
		update: {
			lastUsedAt: new Date(),
		},
	});
}

// Envoi de notification
export async function sendPushNotification(
	userIds: string[],
	notification: {
		type: NotificationType;
		title: string;
		body: string;
		data?: {
			id?: string;
			groupId?: string;
			challengeId?: string;
			completionId?: string;
		};
	}
) {
	// Construire l'URL en fonction du type
	let url = "/app";
	switch (notification.type) {
		case "GROUP_INVITE":
			url = `/app/invites/${notification.data?.id}`;
			break;
		case "CHALLENGE_COMPLETED":
			url = `/app/challenges/${notification.data?.challengeId}`;
			break;
		case "VALIDATION_RECEIVED":
			url = `/app/groups/${notification.data?.groupId}`;
			break;
		// etc...
	}

	// Récupérer tous les appareils des utilisateurs concernés
	const devices = await prisma.pushDevice.findMany({
		where: {
			userId: {
				in: userIds,
			},
		},
	});

	// Créer les notifications en base de données
	await prisma.notification.createMany({
		data: userIds.map((userId) => ({
			userId,
			type: notification.type,
			title: notification.title,
			body: notification.body,
			data: notification.data || {},
		})),
	});

	// Envoyer les notifications push à tous les appareils
	const results = await Promise.allSettled(
		devices.map((device) =>
			webpush.sendNotification(
				{
					endpoint: device.endpoint,
					keys: {
						p256dh: device.p256dh,
						auth: device.auth,
					},
				},
				JSON.stringify({
					...notification,
					url,
				})
			)
		)
	);

	// Nettoyer les appareils invalides
	const invalidDevices = results
		.map((result, index) =>
			result.status === "rejected" ? devices[index].id : null
		)
		.filter(Boolean);

	if (invalidDevices.length > 0) {
		await prisma.pushDevice.deleteMany({
			where: {
				id: {
					in: invalidDevices as string[],
				},
			},
		});
	}
}

// Exemple d'utilisation pour différents cas :
export async function notifyGroupMembers(
	groupId: string,
	notification: {
		type: NotificationType;
		title: string;
		body: string;
	}
) {
	// Récupérer tous les membres du groupe
	const members = await prisma.groupMember.findMany({
		where: { groupId },
		select: { userId: true },
	});

	await sendPushNotification(
		members.map((m) => m.userId),
		{
			...notification,
			data: { groupId },
		}
	);
}

export async function notifyValidators(
	completionId: string,
	notification: {
		type: NotificationType;
		title: string;
		body: string;
	}
) {
	// Récupérer les validateurs
	const validators = await prisma.validationVote.findMany({
		where: { completionId },
		select: { userId: true },
	});

	await sendPushNotification(
		validators.map((v) => v.userId),
		{
			...notification,
			data: { completionId },
		}
	);
}
