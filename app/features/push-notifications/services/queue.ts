import { NotificationType } from "@prisma/client";
import Queue from "bull";
import { sendPushNotifications } from "../actions/send-push-notification";

interface NotificationJob {
	userIds: string[];
	payload: {
		title: string;
		body: string;
		icon?: string;
		badge?: string;
		data: {
			url: string;
			type: NotificationType;
		};
	};
	options?: {
		batchSize?: number;
		stopOnError?: boolean;
	};
}

const notificationQueue = new Queue<NotificationJob>(
	"notifications",
	process.env.REDIS_URL!
);

// Configuration de la queue
notificationQueue.process(async (job) => {
	const { userIds, payload, options } = job.data;
	return sendPushNotifications(userIds, payload, options);
});

// Gestion des erreurs
notificationQueue.on("error", (error) => {
	console.error("[NOTIFICATION_QUEUE] Erreur générale:", error);
});

notificationQueue.on("failed", (job, error) => {
	console.error(`[NOTIFICATION_QUEUE] Échec du job ${job.id}:`, error);
});

export async function queueNotifications(
	userIds: string[],
	payload: NotificationJob["payload"],
	options?: NotificationJob["options"]
) {
	// Ajouter le job à la queue avec des options de retry
	return notificationQueue.add(
		{ userIds, payload, options },
		{
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 1000,
			},
			removeOnComplete: true,
			removeOnFail: false,
		}
	);
}
