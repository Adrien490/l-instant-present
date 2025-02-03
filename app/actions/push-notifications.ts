"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { PushDevice } from "@prisma/client";
import { headers } from "next/headers";
import webpush from "web-push";

webpush.setVapidDetails(
	process.env.VAPID_SUBJECT!,
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

type ServerActionState = {
	success: boolean;
	error?: string;
};

type PushSubscriptionJSON = {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};

export async function subscribeToPush(subscription: {
	endpoint: string;
	toJSON: () => PushSubscriptionJSON;
}): Promise<ServerActionState> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return {
				success: false,
				error: "Vous devez être connecté pour activer les notifications",
			};
		}

		const subscriptionJSON = subscription.toJSON();
		const existingDevice = await db.pushDevice.findUnique({
			where: {
				endpoint: subscription.endpoint,
				userId: session.user.id,
			},
		});

		if (existingDevice) {
			await db.pushDevice.update({
				where: {
					id: existingDevice.id,
				},
				data: {
					endpoint: subscription.endpoint,
					p256dh: subscriptionJSON.keys.p256dh,
					auth: subscriptionJSON.keys.auth,
				},
			});
		} else {
			await db.pushDevice.create({
				data: {
					endpoint: subscription.endpoint,
					p256dh: subscriptionJSON.keys.p256dh,
					auth: subscriptionJSON.keys.auth,
					userId: session.user.id,
				},
			});
		}

		return { success: true };
	} catch (error) {
		console.error("[PUSH_NOTIFICATIONS] Subscribe failed:", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de l'activation des notifications",
		};
	}
}

export async function unsubscribeFromPush(
	endpoint: string
): Promise<ServerActionState> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return {
				success: false,
				error: "Vous devez être connecté pour désactiver les notifications",
			};
		}

		await db.pushDevice.deleteMany({
			where: {
				endpoint,
				userId: session.user.id,
			},
		});

		return { success: true };
	} catch (error) {
		console.error("[PUSH_NOTIFICATIONS] Unsubscribe failed:", error);
		return {
			success: false,
			error:
				"Une erreur est survenue lors de la désactivation des notifications",
		};
	}
}

export async function sendPushNotification(
	userId: string,
	payload: {
		title: string;
		body: string;
		data?: Record<string, unknown>;
	}
): Promise<ServerActionState> {
	try {
		const devices = await db.pushDevice.findMany({
			where: {
				userId,
			},
		});

		await Promise.all(
			devices.map((device: PushDevice) =>
				webpush.sendNotification(
					{
						endpoint: device.endpoint,
						keys: {
							p256dh: device.p256dh,
							auth: device.auth,
						},
					},
					JSON.stringify(payload)
				)
			)
		);

		return { success: true };
	} catch (error) {
		console.error("[PUSH_NOTIFICATIONS] Send notification failed:", error);
		return {
			success: false,
			error: "Une erreur est survenue lors de l'envoi de la notification",
		};
	}
}
