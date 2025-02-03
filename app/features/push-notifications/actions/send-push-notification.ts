"use server";

import db from "@/lib/db";
import { NotificationType, Prisma, PushDevice } from "@prisma/client";
import webpush from "web-push";
import {
	deviceCounter,
	notificationCounter,
	notificationDuration,
	rateLimitCounter,
	retryCounter,
} from "../services/metrics";
import { queueNotifications } from "../services/queue";
import { RateLimiter } from "../services/rate-limiter";

// Constantes de configuration
const CONFIG = {
	MAX_BATCH_SIZE: 50,
	DEFAULT_BATCH_SIZE: 10,
	MAX_RETRIES: 3,
	RETRY_DELAY: 1000, // ms
	MAX_PAYLOAD_SIZE: 4096, // bytes
	RATE_LIMIT: {
		WINDOW: 60 * 1000, // 1 minute
		MAX_REQUESTS: 1000,
	},
	QUEUE_THRESHOLD: 100, // Utiliser la queue si plus de X utilisateurs
} as const;

// Vérification des variables d'environnement requises
const requiredEnvVars = {
	VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
	VAPID_EMAIL: process.env.VAPID_EMAIL,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_USERNAME: process.env.REDIS_USERNAME,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`La variable d'environnement ${key} est manquante`);
	}
});

// Configuration de web-push avec les clés VAPID
webpush.setVapidDetails(
	`mailto:${requiredEnvVars.VAPID_EMAIL}`,
	requiredEnvVars.VAPID_PUBLIC_KEY!,
	requiredEnvVars.VAPID_PRIVATE_KEY!
);

const rateLimiter = new RateLimiter();

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
	retries?: number;
}

function validatePayload(payload: PushNotificationPayload): void {
	if (!payload.title || payload.title.length > 50) {
		throw new Error("Titre invalide");
	}
	if (!payload.body || payload.body.length > 200) {
		throw new Error("Corps du message invalide");
	}
	if (!payload.data.url || !payload.data.url.startsWith("/")) {
		throw new Error("URL invalide");
	}

	const payloadSize = new TextEncoder().encode(JSON.stringify(payload)).length;
	if (payloadSize > CONFIG.MAX_PAYLOAD_SIZE) {
		throw new Error("Payload trop volumineux");
	}
}

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendNotificationToDevice(
	device: PushDevice,
	payload: PushNotificationPayload,
	retries = 0
): Promise<boolean> {
	try {
		validatePayload(payload);

		// Vérifier le rate limit
		const isAllowed = await rateLimiter.increment(device.userId);
		if (!isAllowed) {
			rateLimitCounter.inc();
			throw new Error("Rate limit exceeded");
		}

		const startTime = Date.now();

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

		// Mesurer la durée
		notificationDuration.observe((Date.now() - startTime) / 1000);

		await db.pushDevice.update({
			where: { id: device.id },
			data: { lastUsedAt: new Date() },
		});

		deviceCounter.inc({ status: "success" });
		return true;
	} catch (error) {
		console.error(
			`[PUSH_NOTIFICATION] Échec d'envoi au device ${device.id} (tentative ${
				retries + 1
			}/${CONFIG.MAX_RETRIES}):`,
			error
		);

		deviceCounter.inc({ status: "error" });

		if (error instanceof Error) {
			if (error.message.includes("expired")) {
				await db.pushDevice.delete({ where: { id: device.id } });
				return false;
			}

			if (
				retries < CONFIG.MAX_RETRIES &&
				(error.message.includes("timeout") ||
					error.message.includes("network") ||
					error.message.includes("429"))
			) {
				retryCounter.inc();
				await sleep(CONFIG.RETRY_DELAY * (retries + 1));
				return sendNotificationToDevice(device, payload, retries + 1);
			}
		}

		return false;
	}
}

async function createNotificationRecords(
	userIds: string[],
	payload: PushNotificationPayload
) {
	try {
		return await db.notification.createMany({
			data: userIds.map((userId) => ({
				userId,
				type: payload.data.type,
				title: payload.title,
				body: payload.body,
				data: JSON.parse(JSON.stringify(payload.data)) as Prisma.JsonObject,
			})),
		});
	} catch (error) {
		console.error(
			"[PUSH_NOTIFICATION] Erreur de création des notifications:",
			error
		);
		throw error;
	}
}

async function sendNotificationToUser(
	userId: string,
	payload: PushNotificationPayload
): Promise<NotificationResult> {
	try {
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
	const batchSize = Math.min(
		options.batchSize || CONFIG.DEFAULT_BATCH_SIZE,
		CONFIG.MAX_BATCH_SIZE
	);
	const { stopOnError = false } = options;

	try {
		validatePayload(payload);

		const uniqueUserIds = [...new Set(userIds)];

		if (uniqueUserIds.length === 0) {
			console.info("[PUSH_NOTIFICATION] Aucun utilisateur à notifier");
			return [];
		}

		// Utiliser la queue pour les gros volumes
		if (uniqueUserIds.length > CONFIG.QUEUE_THRESHOLD) {
			console.info(
				`[PUSH_NOTIFICATION] Utilisation de la queue pour ${uniqueUserIds.length} utilisateurs`
			);
			await queueNotifications(uniqueUserIds, payload, options);
			return [];
		}

		const startTime = Date.now();

		const results: NotificationResult[] = [];
		const batches = [];

		for (let i = 0; i < uniqueUserIds.length; i += batchSize) {
			batches.push(uniqueUserIds.slice(i, i + batchSize));
		}

		for (const batch of batches) {
			const batchResults = await Promise.all(
				batch.map((userId) => sendNotificationToUser(userId, payload))
			);

			results.push(...batchResults);

			if (stopOnError && batchResults.some((r) => !r.success)) {
				break;
			}
		}

		const successfulUserIds = results
			.filter((r) => r.success)
			.map((r) => r.userId);

		if (successfulUserIds.length > 0) {
			await createNotificationRecords(successfulUserIds, payload);
		}

		// Métriques
		notificationCounter.inc(
			{ status: "success", type: payload.data.type },
			successfulUserIds.length
		);
		notificationCounter.inc(
			{ status: "error", type: payload.data.type },
			uniqueUserIds.length - successfulUserIds.length
		);

		const stats = {
			total: results.length,
			success: successfulUserIds.length,
			devicesTotal: results.reduce((sum, r) => sum + r.deviceCount, 0),
			devicesSuccess: results.reduce((sum, r) => sum + r.successCount, 0),
			duration: Date.now() - startTime,
		};

		console.info("[PUSH_NOTIFICATION] Statistiques:", stats);

		return results;
	} catch (error) {
		console.error("[PUSH_NOTIFICATION] Erreur inattendue:", error);
		throw error;
	}
}

export default async function sendPushNotification(
	userId: string,
	payload: PushNotificationPayload
) {
	const results = await sendPushNotifications([userId], payload);
	return results[0];
}
