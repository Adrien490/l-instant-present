"use server";

import webpush from "web-push";
import prisma from "./db";

webpush.setVapidDetails(
	"mailto:your@email.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

interface PushSubscriptionKeys {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

// Enregistrement d'un nouvel appareil
export async function registerDevice(
	subscription: PushSubscriptionKeys,
	userAgent?: string
) {
	return prisma.pushDevice.upsert({
		where: {
			endpoint: subscription.endpoint,
		},
		create: {
			userId: "user-id",
			endpoint: subscription.endpoint,
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth,
			userAgent,
		},
		update: {
			lastUsedAt: new Date(),
		},
	});
}

// Envoi de notification
