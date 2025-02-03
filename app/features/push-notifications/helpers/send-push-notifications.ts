import { CONFIG } from "../config/config";
import { validatePayload } from "../lib/utils";
import {
	createNotificationRecords,
	sendNotificationToUser,
} from "../services/notification-service";
import { NotificationResult, PushNotificationPayload } from "../types";

export default async function sendPushNotifications(
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

		if (uniqueUserIds.length > 1000) {
			console.warn(
				`[PUSH_NOTIFICATION] Grand nombre d'utilisateurs (${uniqueUserIds.length})`
			);
		}

		const results: NotificationResult[] = [];
		const batches = [];

		for (let i = 0; i < uniqueUserIds.length; i += batchSize) {
			batches.push(uniqueUserIds.slice(i, i + batchSize));
		}

		const startTime = Date.now();

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

		const stats = {
			total: results.length,
			success: results.filter((r) => r.success).length,
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

export async function sendPushNotification(
	userId: string,
	payload: PushNotificationPayload
) {
	const results = await sendPushNotifications([userId], payload);
	return results[0];
}
