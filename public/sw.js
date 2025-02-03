// Installation du SW
self.addEventListener("install", () => {
	self.skipWaiting();
});

// Activation du SW
self.addEventListener("activate", (event) => {
	event.waitUntil(clients.claim());
});

// Gestion des notifications push
self.addEventListener("push", (event) => {
	const data = event.data.json();

	// Vérifier si l'utilisateur est déconnecté
	if (data.data?.isLoggedOut) {
		// Ne pas afficher la notification si l'utilisateur est déconnecté
		return;
	}

	// Configuration des options de notification en fonction du type
	const options = {
		body: data.body,
		icon: data.icon || "/icon-192x192.png",
		badge: data.badge || "/badge.png",
		vibrate: [200], // Vibration simple et unique
		data: {
			url: data.data?.url || "/app",
			type: data.data?.type,
		},
		actions: [],
	};

	// Ajouter des actions spécifiques selon le type de notification
	if (data.data?.type === "GROUP_INVITE") {
		options.actions = [
			{
				action: "open",
				title: "Voir l'invitation",
			},
		];
		options.requireInteraction = true; // La notification reste jusqu'à ce que l'utilisateur interagisse
		options.tag = `group-invite-${data.data.groupId}`; // Regrouper les notifications par groupe
		options.renotify = true; // Notifier même si une notification avec le même tag existe
	} else if (data.data?.type === "MEMBER_JOINED") {
		options.actions = [
			{
				action: "open",
				title: "Voir les membres",
			},
		];
		options.tag = `group-member-${data.data.groupId}`; // Regrouper les notifications par groupe
		options.renotify = true; // Notifier même si une notification avec le même tag existe
	} else {
		options.actions = [
			{
				action: "open",
				title: "Voir",
			},
			{
				action: "close",
				title: "Fermer",
			},
		];
	}

	event.waitUntil(self.registration.showNotification(data.title, options));
});

// Gestion des clics sur les notifications
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const urlToOpen = event.notification.data?.url || "/app";

	// Ouvrir l'URL appropriée
	event.waitUntil(
		clients
			.matchAll({
				type: "window",
				includeUncontrolled: true,
			})
			.then((windowClients) => {
				// Chercher si une fenêtre de l'app est déjà ouverte
				const appClient = windowClients.find((client) =>
					client.url.includes(self.registration.scope)
				);

				if (appClient) {
					// Si une fenêtre est ouverte, la focus et naviguer
					appClient.focus();
					if ("navigate" in appClient) {
						return appClient.navigate(urlToOpen);
					}
				}
				// Si aucune fenêtre n'existe, en ouvrir une nouvelle
				return clients.openWindow(urlToOpen);
			})
	);
});

// Gestion de la fermeture des notifications
self.addEventListener("notificationclose", (event) => {
	// Vous pouvez ajouter ici de la logique pour tracker les notifications fermées
	console.log("Notification fermée sans action:", event.notification.data);
});
