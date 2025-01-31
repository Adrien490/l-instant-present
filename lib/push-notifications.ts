"use server";

import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
	"mailto:contact@example.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

let subscriptions: PushSubscription[] = [];

export async function subscribeUser(sub: PushSubscription) {
	subscriptions.push(sub);
	return { success: true };
}

export async function unsubscribeUser() {
	subscriptions = [];
	return { success: true };
}

export async function sendNotification(message: string) {
	if (subscriptions.length === 0) {
		throw new Error("No subscriptions available");
	}

	const notifications = subscriptions.map((subscription) =>
		webpush.sendNotification(
			subscription,
			JSON.stringify({
				title: "L'instant présent",
				body: message,
				icon: "/icon.png",
			})
		)
	);

	await Promise.all(notifications);
	return { success: true };
}
