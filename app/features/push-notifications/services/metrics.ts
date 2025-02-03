import { Counter, Histogram } from "prom-client";

// Métriques Prometheus
export const notificationCounter = new Counter({
	name: "push_notifications_total",
	help: "Nombre total de notifications envoyées",
	labelNames: ["status", "type"],
});

export const notificationDuration = new Histogram({
	name: "push_notification_duration_seconds",
	help: "Durée d'envoi des notifications",
	buckets: [0.1, 0.5, 1, 2, 5],
});

export const deviceCounter = new Counter({
	name: "push_notification_devices_total",
	help: "Nombre total d'appareils notifiés",
	labelNames: ["status"],
});

export const rateLimitCounter = new Counter({
	name: "push_notification_rate_limit_total",
	help: "Nombre de fois où le rate limit a été atteint",
});

export const retryCounter = new Counter({
	name: "push_notification_retries_total",
	help: "Nombre de retentatives d'envoi",
});
