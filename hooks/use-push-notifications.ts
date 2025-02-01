"use client";

import { registerDevice } from "@/lib/notifications";
import { useEffect, useState } from "react";

export function usePushNotifications() {
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);
	const [permission, setPermission] =
		useState<NotificationPermission>("default");

	useEffect(() => {
		if ("Notification" in window) {
			setPermission(Notification.permission);
			checkExistingSubscription();
		}
	}, []);

	async function checkExistingSubscription() {
		if ("serviceWorker" in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const existingSubscription =
				await registration.pushManager.getSubscription();
			setSubscription(existingSubscription);
		}
	}

	async function subscribe() {
		try {
			console.log("Début de l'inscription aux notifications");

			// Vérifier si le service worker est enregistré
			if (!("serviceWorker" in navigator)) {
				console.error("Service Worker non supporté");
				return;
			}

			const registration = await navigator.serviceWorker.ready;
			console.log("Service Worker prêt", registration);

			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
			});
			console.log("Subscription créée", sub);

			// Convertir en PushSubscriptionKeys
			const subscription = {
				endpoint: sub.endpoint,
				keys: {
					p256dh: Buffer.from(sub.getKey("p256dh")!).toString("base64"),
					auth: Buffer.from(sub.getKey("auth")!).toString("base64"),
				},
			};

			await registerDevice(subscription, navigator.userAgent);
			console.log("Appareil enregistré en base de données");

			setSubscription(sub);
			setPermission("granted");
		} catch (error) {
			console.error("Erreur lors de l'inscription:", error);
		}
	}

	return {
		permission,
		subscription,
		subscribe,
	};
}
