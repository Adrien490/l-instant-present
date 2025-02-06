import { PushNotificationPayload } from "../types";
import { CONFIG } from "./config";

export function validatePayload(payload: PushNotificationPayload): void {
	if (!payload.title || payload.title.length > 50) {
		throw new Error("Titre invalide");
	}
	if (!payload.body || payload.body.length > 200) {
		throw new Error("Corps du message invalide");
	}
	if (!payload.data.url || !payload.data.url.startsWith("/")) {
		throw new Error("URL invalide");
	}

	const payloadSize = new TextEncoder().encode(JSON.stringify(payload)).length;
	if (payloadSize > CONFIG.MAX_PAYLOAD_SIZE) {
		throw new Error("Payload trop volumineux");
	}
}

export async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
