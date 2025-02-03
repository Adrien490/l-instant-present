import { NotificationType } from "@prisma/client";
import { z } from "zod";

const sendPushNotificationSchema = z.object({
	userId: z.string().uuid(),
	payload: z.object({
		title: z.string().min(1),
		body: z.string().min(1),
		icon: z.string().optional(),
		badge: z.string().optional(),
		data: z.object({
			url: z.string().min(1),
			type: z.nativeEnum(NotificationType),
			isLoggedOut: z.boolean().optional(),
		}),
	}),
});

export type SendPushNotificationParams = z.infer<
	typeof sendPushNotificationSchema
>;

export default sendPushNotificationSchema;
