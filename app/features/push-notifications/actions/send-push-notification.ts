"use server";

import db from "@/lib/db";
import { NotificationType, Prisma, PushDevice } from "@prisma/client";
import webpush from "web-push";

// Vérification des variables d'environnement requises
const requiredEnvVars = {
	VAPID_SUBJECT: process.env.VAPID_SUBJECT,
	VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`La variable d'environnement ${key} est manquante`);
	}
});

// Configuration de web-push avec les clés VAPID
webpush.setVapidDetails(
	requiredEnvVars.VAPID_SUBJECT!,
	requiredEnvVars.VAPID_PUBLIC_KEY!,
	requiredEnvVars.VAPID_PRIVATE_KEY!
);

interface PushNotificationPayload {
	title: string;
	body: string;
	icon?: string;
	badge?: string;
	data: {
		url: string;
		type: NotificationType;
	};
}

interface NotificationResult {
	userId: string;
	success: boolean;
	deviceCount: number;
	successCount: number;
	error?: string;
}

async function sendNotificationToDevice(
	device: PushDevice,
	payload: PushNotificationPayload
) {
	try {
		await webpush.sendNotification(
			{
				endpoint: device.endpoint,
				keys: {
					p256dh: device.p256dh,
					auth: device.auth,
				},
			},
			JSON.stringify({
				...payload,
				icon: payload.icon || "/icon.png",
				badge: payload.badge || "/badge.png",
				data: {
					...payload.data,
					isLoggedOut: false,
				},
			})
		);

		// Mettre à jour la date de dernière utilisation
		await db.pushDevice.update({
			where: { id: device.id },
			data: { lastUsedAt: new Date() },
		});

		return true;
	} catch (error) {
		console.error(
			`[PUSH_NOTIFICATION] Échec d'envoi au device ${device.id}:`,
			error
		);

		// Si l'abonnement n'est plus valide, supprimer l'appareil
		if (error instanceof Error && error.message.includes("expired")) {
			await db.pushDevice.delete({ where: { id: device.id } });
		}

		return false;
	}
}

async function createNotificationRecords(
	userIds: string[],
	payload: PushNotificationPayload
) {
	return db.notification.createMany({
		data: userIds.map((userId) => ({
			userId,
			type: payload.data.type,
			title: payload.title,
			body: payload.body,
			data: JSON.parse(JSON.stringify(payload.data)) as Prisma.JsonObject,
		})),
	});
}

async function sendNotificationToUser(
	userId: string,
	payload: PushNotificationPayload
): Promise<NotificationResult> {
	try {
		// Récupérer tous les appareils de l'utilisateur
		const pushDevices = await db.pushDevice.findMany({
			where: { userId },
		});

		if (pushDevices.length === 0) {
			return {
				userId,
				success: true,
				deviceCount: 0,
				successCount: 0,
			};
		}

		// Envoyer la notification à tous les appareils
		const results = await Promise.all(
			pushDevices.map((device) => sendNotificationToDevice(device, payload))
		);

		const successCount = results.filter(Boolean).length;

		return {
			userId,
			success: true,
			deviceCount: pushDevices.length,
			successCount,
		};
	} catch (error) {
		console.error(
			`[PUSH_NOTIFICATION] Erreur pour l'utilisateur ${userId}:`,
			error
		);
		return {
			userId,
			success: false,
			deviceCount: 0,
			successCount: 0,
			error: error instanceof Error ? error.message : "Erreur inconnue",
		};
	}
}

export async function sendPushNotifications(
	userIds: string[],
	payload: PushNotificationPayload,
	options: { batchSize?: number; stopOnError?: boolean } = {}
): Promise<NotificationResult[]> {
	const { batchSize = 10, stopOnError = false } = options;

	try {
		// Dédupliquer les IDs utilisateurs
		const uniqueUserIds = [...new Set(userIds)];

		if (uniqueUserIds.length === 0) {
			console.info("[PUSH_NOTIFICATION] Aucun utilisateur à notifier");
			return [];
		}

		const results: NotificationResult[] = [];
		const batches = [];

		// Diviser les utilisateurs en lots
		for (let i = 0; i < uniqueUserIds.length; i += batchSize) {
			batches.push(uniqueUserIds.slice(i, i + batchSize));
		}

		// Traiter chaque lot
		for (const batch of batches) {
			const batchResults = await Promise.all(
				batch.map((userId) => sendNotificationToUser(userId, payload))
			);

			results.push(...batchResults);

			// Vérifier les erreurs si stopOnError est activé
			if (stopOnError && batchResults.some((r) => !r.success)) {
				break;
			}
		}

		// Créer les enregistrements de notification pour les utilisateurs avec succès
		const successfulUserIds = results
			.filter((r) => r.success)
			.map((r) => r.userId);

		if (successfulUserIds.length > 0) {
			await createNotificationRecords(successfulUserIds, payload);
		}

		// Logs des statistiques
		const stats = {
			total: results.length,
			success: results.filter((r) => r.success).length,
			devicesTotal: results.reduce((sum, r) => sum + r.deviceCount, 0),
			devicesSuccess: results.reduce((sum, r) => sum + r.successCount, 0),
		};

		console.info("[PUSH_NOTIFICATION] Statistiques:", stats);

		return results;
	} catch (error) {
		console.error("[PUSH_NOTIFICATION] Erreur inattendue:", error);
		throw error;
	}
}

// Pour la compatibilité avec l'ancien code
export default async function sendPushNotification(
	userId: string,
	payload: PushNotificationPayload
) {
	const results = await sendPushNotifications([userId], payload);
	return results[0];
}
