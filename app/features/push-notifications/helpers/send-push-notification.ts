import { PushNotificationPayload } from "../types";
import sendPushNotifications from "./send-push-notifications";

export default async function sendPushNotification(
	userId: string,
	payload: PushNotificationPayload
) {
	const results = await sendPushNotifications([userId], payload);
	return results[0];
}
