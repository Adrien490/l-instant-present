import db from "@/lib/db";
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
