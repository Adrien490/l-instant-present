"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function usePushNotifications() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [permission, setPermission] =
		useState<NotificationPermission>("default");

	useEffect(() => {
		const checkSupport = async () => {
			const supported =
				"serviceWorker" in navigator &&
				"PushManager" in window &&
				"Notification" in window;

			setIsSupported(supported);
			if (supported) {
				setPermission(Notification.permission);
				await registerServiceWorker();
			}
			setIsLoading(false);
		};

		checkSupport();
	}, []);

	async function registerServiceWorker() {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});
			const sub = await registration.pushManager.getSubscription();
			setSubscription(sub);
		} catch (error) {
			console.error("[PUSH_NOTIFICATIONS] Failed to register SW:", error);
			toast.error(
				"Impossible d'initialiser les notifications. Veuillez réessayer."
			);
		}
	}

	async function requestPermission(): Promise<boolean> {
		try {
			const result = await Notification.requestPermission();
			setPermission(result);
			return result === "granted";
		} catch (error) {
			console.error("[PUSH_NOTIFICATIONS] Permission request failed:", error);
			toast.error(
				"Impossible de demander la permission. Veuillez vérifier vos paramètres de navigateur."
			);
			return false;
		}
	}

	async function subscribe() {
		try {
			if (permission !== "granted") {
				const granted = await requestPermission();
				if (!granted) return null;
			}

			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
				),
			});

			// Enregistrer l'abonnement dans la base de données
			const response = await fetch("/api/push/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});

			if (!response.ok) {
				throw new Error("Failed to save subscription");
			}

			setSubscription(subscription);
			toast.success("Notifications activées avec succès !");
			return subscription;
		} catch (error) {
			console.error("[PUSH_NOTIFICATIONS] Subscription failed:", error);
			toast.error(
				"Impossible d'activer les notifications. Veuillez réessayer."
			);
			return null;
		}
	}

	async function unsubscribe() {
		try {
			if (!subscription) return;

			await subscription.unsubscribe();

			// Supprimer l'abonnement de la base de données
			const response = await fetch("/api/push/unsubscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ endpoint: subscription.endpoint }),
			});

			if (!response.ok) {
				throw new Error("Failed to unsubscribe");
			}

			setSubscription(null);
			toast.success("Notifications désactivées.");
		} catch (error) {
			console.error("[PUSH_NOTIFICATIONS] Unsubscribe failed:", error);
			toast.error(
				"Impossible de désactiver les notifications. Veuillez réessayer."
			);
		}
	}

	return {
		isSupported,
		isLoading,
		subscription,
		permission,
		subscribe,
		unsubscribe,
		requestPermission,
	};
}
