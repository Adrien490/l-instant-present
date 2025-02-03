// Version du SW pour le cache busting
const SW_VERSION = "1.0.0";

// Configuration
const CONFIG = {
	DEBUG: false, // Désactiver en production
	NOTIFICATION_TIMEOUT: 5000, // 5 secondes
	DEFAULT_ICON: "/icon-192x192.png",
	DEFAULT_BADGE: "/badge.png",
	DEFAULT_URL: "/app",
	VIBRATION_PATTERN: [200],
};

// Types de notifications supportés
const NOTIFICATION_TYPES = {
	GROUP_INVITE: {
		requireInteraction: true,
		actions: [{ action: "open", title: "Voir l'invitation" }],
		timeout: 0, // Pas de timeout
	},
	MEMBER_JOINED: {
		requireInteraction: false,
		actions: [{ action: "open", title: "Voir les membres" }],
		timeout: CONFIG.NOTIFICATION_TIMEOUT,
	},
	DEFAULT: {
		requireInteraction: false,
		actions: [
			{ action: "open", title: "Voir" },
			{ action: "close", title: "Fermer" },
		],
		timeout: CONFIG.NOTIFICATION_TIMEOUT,
	},
};

// Logging conditionnel
const log = {
	info: (...args) => CONFIG.DEBUG && console.info("[SW]", ...args),
	error: (...args) => CONFIG.DEBUG && console.error("[SW]", ...args),
	warn: (...args) => CONFIG.DEBUG && console.warn("[SW]", ...args),
};

// Installation du SW avec précaching
self.addEventListener("install", (event) => {
	log.info("Installation du SW version", SW_VERSION);
	event.waitUntil(
		Promise.all([
			self.skipWaiting(),
			// Précharger les ressources essentielles
			caches
				.open("notification-assets-v1")
				.then((cache) =>
					cache.addAll([CONFIG.DEFAULT_ICON, CONFIG.DEFAULT_BADGE])
				),
		]).catch((error) => log.error("Erreur installation:", error))
	);
});

// Activation avec nettoyage des anciens caches
self.addEventListener("activate", (event) => {
	log.info("Activation du SW version", SW_VERSION);
	event.waitUntil(
		Promise.all([
			clients.claim(),
			// Nettoyer les anciens caches
			caches
				.keys()
				.then((keys) =>
					Promise.all(
						keys
							.filter(
								(key) =>
									key.startsWith("notification-assets-") &&
									key !== "notification-assets-v1"
							)
							.map((key) => caches.delete(key))
					)
				),
		]).catch((error) => log.error("Erreur activation:", error))
	);
});

// Gestion des notifications push avec retry
self.addEventListener("push", async (event) => {
	try {
		const data = event.data.json();
		log.info("Notification reçue:", data);

		// Vérifications de sécurité
		if (!data || !data.title || !data.body) {
			throw new Error("Payload invalide");
		}

		// Vérifier si l'utilisateur est déconnecté
		if (data.data?.isLoggedOut) {
			log.info("Utilisateur déconnecté, notification ignorée");
			return;
		}

		// Configuration des options de notification
		const notificationType = data.data?.type || "DEFAULT";
		const typeConfig =
			NOTIFICATION_TYPES[notificationType] || NOTIFICATION_TYPES.DEFAULT;

		const options = {
			body: data.body,
			icon: await getCachedImage(data.icon || CONFIG.DEFAULT_ICON),
			badge: await getCachedImage(data.badge || CONFIG.DEFAULT_BADGE),
			image: data.data?.image
				? await getCachedImage(data.data.image)
				: undefined,
			vibrate: CONFIG.VIBRATION_PATTERN,
			timestamp: Date.now(),
			requireInteraction: typeConfig.requireInteraction,
			actions: typeConfig.actions,
			tag: data.data?.groupId
				? `${notificationType}-${data.data.groupId}`
				: undefined,
			renotify: true,
			data: {
				url: data.data?.url || CONFIG.DEFAULT_URL,
				type: data.data?.type,
				version: SW_VERSION,
				timestamp: Date.now(),
			},
		};

		// Afficher la notification avec retry
		await retryOperation(
			() => self.registration.showNotification(data.title, options),
			3,
			1000
		);

		// Programmer la suppression automatique si nécessaire
		if (typeConfig.timeout > 0) {
			setTimeout(() => {
				self.registration.getNotifications().then((notifications) => {
					notifications
						.filter((n) => n.data?.timestamp === options.data.timestamp)
						.forEach((n) => n.close());
				});
			}, typeConfig.timeout);
		}
	} catch (error) {
		log.error("Erreur traitement notification:", error);
		throw error; // Laisser le SW gérer l'erreur
	}
});

// Gestion améliorée des clics sur les notifications
self.addEventListener("notificationclick", async (event) => {
	try {
		const notification = event.notification;
		const action = event.action;
		const data = notification.data;

		log.info("Clic sur notification:", { action, data });

		// Fermer la notification
		notification.close();

		if (action === "close") return;

		const urlToOpen = data?.url || CONFIG.DEFAULT_URL;

		// Focus ou ouvrir la fenêtre
		const windowClients = await clients.matchAll({
			type: "window",
			includeUncontrolled: true,
		});

		// Chercher une fenêtre existante ou en ouvrir une nouvelle
		const appClient = windowClients.find((client) =>
			client.url.includes(self.registration.scope)
		);

		if (appClient) {
			await appClient.focus();
			if ("navigate" in appClient) {
				await appClient.navigate(urlToOpen);
			}
		} else {
			await clients.openWindow(urlToOpen);
		}

		// Analytics
		if (CONFIG.DEBUG) {
			trackNotificationInteraction(notification, action);
		}
	} catch (error) {
		log.error("Erreur gestion clic:", error);
	}
});

// Gestion de la fermeture avec analytics
self.addEventListener("notificationclose", (event) => {
	const notification = event.notification;
	log.info("Notification fermée:", notification.data);

	if (CONFIG.DEBUG) {
		trackNotificationClose(notification);
	}
});

// Utilitaires
async function getCachedImage(url) {
	if (!url) return undefined;

	try {
		const cache = await caches.open("notification-assets-v1");
		let response = await cache.match(url);

		if (!response) {
			response = await fetch(url);
			if (response.ok) {
				await cache.put(url, response.clone());
			}
		}

		return url;
	} catch (error) {
		log.error("Erreur chargement image:", error);
		return undefined;
	}
}

async function retryOperation(operation, maxRetries, delay) {
	let lastError;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;
			log.warn(`Tentative ${i + 1}/${maxRetries} échouée:`, error);
			await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
		}
	}

	throw lastError;
}

function trackNotificationInteraction(notification, action) {
	// TODO: Implémenter le tracking des interactions
	log.info("Track interaction:", {
		type: notification.data?.type,
		action,
		timestamp: Date.now(),
	});
}

function trackNotificationClose(notification) {
	// TODO: Implémenter le tracking des fermetures
	log.info("Track fermeture:", {
		type: notification.data?.type,
		timestamp: Date.now(),
	});
}
