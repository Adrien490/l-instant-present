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

	// Configuration des options de notification en fonction du type
	const options = {
		body: data.body,
		icon: data.icon || "/icon-192x192.png",
		badge: data.badge || "/badge.png",
		vibrate: [200], // Vibration simple et unique
		data: {
			url: data.data?.url || "/app",
			type: data.data?.type,
			id: data.data?.id,
			groupId: data.data?.groupId,
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

	let urlToOpen = "/app";

	// Gérer les différentes actions selon le type de notification
	if (event.notification.data?.type === "GROUP_INVITE") {
		urlToOpen = `app/invites/${event.notification.data.id}`;
	} else {
		if (event.action === "open" || !event.action) {
			urlToOpen = event.notification.data?.url || "/app";
		}
	}

	// Ouvrir l'URL appropriée
	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((windowClients) => {
				// Chercher une fenêtre existante avec l'URL
				for (const client of windowClients) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
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
