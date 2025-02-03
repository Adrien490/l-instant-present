import { default as db, default as prisma } from "@/lib/db";
import { Prisma, PushDevice } from "@prisma/client";
import webpush from "web-push";
import { CONFIG } from "../config/config";
import { sleep, validatePayload } from "../lib/utils";
import { NotificationResult, PushNotificationPayload } from "../types";
import { RateLimiter } from "./rate-limiter";

const rateLimiter = new RateLimiter();

export async function sendNotificationToDevice(
	device: PushDevice,
	payload: PushNotificationPayload,
	retries = 0
): Promise<boolean> {
	try {
		validatePayload(payload);
		const canSend = await rateLimiter.increment(device.userId);
		if (!canSend) {
			throw new Error("Rate limit exceeded");
		}

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

		await db.pushDevice.update({
			where: { id: device.id },
			data: { lastUsedAt: new Date() },
		});

		return true;
	} catch (error) {
		console.error(
			`[PUSH_NOTIFICATION] Échec d'envoi au device ${device.id} (tentative ${
				retries + 1
			}/${CONFIG.MAX_RETRIES}):`,
			error
		);

		if (error instanceof Error) {
			// Gérer les erreurs spécifiques
			if (error.message.includes("expired")) {
				await db.pushDevice.delete({ where: { id: device.id } });
				return false;
			}

			// Retry pour certaines erreurs
			if (
				retries < CONFIG.MAX_RETRIES &&
				(error.message.includes("timeout") ||
					error.message.includes("network") ||
					error.message.includes("429"))
			) {
				await sleep(CONFIG.RETRY_DELAY * (retries + 1));
				return sendNotificationToDevice(device, payload, retries + 1);
			}
		}

		return false;
	}
}

export async function createNotificationRecords(
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

export async function sendNotificationToUser(
	userId: string,
	payload: PushNotificationPayload
): Promise<NotificationResult> {
	try {
		// Vérifier si l'utilisateur a une session active
		const hasActiveSession = await prisma.session.findFirst({
			where: {
				userId,
				expiresAt: {
					gt: new Date(), // Session non expirée
				},
			},
		});

		if (!hasActiveSession) {
			return {
				userId,
				success: false,
				deviceCount: 0,
				successCount: 0,
				error: "User is logged out",
			};
		}

		// Récupérer les devices de l'utilisateur
		const devices = await prisma.pushDevice.findMany({
			where: { userId },
		});

		if (devices.length === 0) {
			return {
				userId,
				success: false,
				deviceCount: 0,
				successCount: 0,
				error: "No devices found",
			};
		}

		// Ajouter l'information de connexion au payload
		const payloadWithSession = {
			...payload,
			data: {
				...payload.data,
				isLoggedIn: true,
			},
		};

		const results = await Promise.all(
			devices.map((device) =>
				sendNotificationToDevice(device, payloadWithSession)
			)
		);

		const successCount = results.filter(Boolean).length;

		return {
			userId,
			success: true,
			deviceCount: devices.length,
			successCount,
		};
	} catch (error) {
		console.error(`[PUSH_NOTIFICATION] Error for user ${userId}:`, error);
		return {
			userId,
			success: false,
			deviceCount: 0,
			successCount: 0,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
