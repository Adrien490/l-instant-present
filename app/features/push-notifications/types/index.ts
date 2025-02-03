import { NotificationType } from "@prisma/client";

export interface PushNotificationPayload {
	title: string;
	body: string;
	icon?: string;
	badge?: string;
	data: {
		url: string;
		type: NotificationType;
	};
}

export interface NotificationResult {
	userId: string;
	success: boolean;
	deviceCount: number;
	successCount: number;
	error?: string;
	retries?: number;
}
