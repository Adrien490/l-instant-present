import webpush from "web-push";

// Constantes de configuration
export const CONFIG = {
	MAX_BATCH_SIZE: 50,
	DEFAULT_BATCH_SIZE: 10,
	MAX_RETRIES: 3,
	RETRY_DELAY: 1000, // ms
	MAX_PAYLOAD_SIZE: 4096, // bytes
	RATE_LIMIT: {
		WINDOW: 60 * 1000, // 1 minute
		MAX_REQUESTS: 1000,
	},
} as const;

// Vérification des variables d'environnement requises
const requiredEnvVars = {
	VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
	VAPID_EMAIL: process.env.VAPID_EMAIL,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`La variable d'environnement ${key} est manquante`);
	}
});

// Configuration de web-push avec les clés VAPID
webpush.setVapidDetails(
	`mailto:${requiredEnvVars.VAPID_EMAIL}`,
	requiredEnvVars.VAPID_PUBLIC_KEY!,
	requiredEnvVars.VAPID_PRIVATE_KEY!
);
