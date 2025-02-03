"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { PushDevice } from "@prisma/client";
import { headers } from "next/headers";
import subscribeSchema from "../schemas/subscribe-schema";

export default async function subscribe(
	_: ServerActionState<PushDevice, typeof subscribeSchema> | null,
	formData: FormData
): Promise<ServerActionState<PushDevice, typeof subscribeSchema>> {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});

		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour activer les notifications"
			);
		}

		const rawData = {
			subscription: JSON.parse(
				formData.get("subscription")?.toString() || "{}"
			),
		};

		const validation = subscribeSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const existingDevice = await db.pushDevice.findUnique({
			where: {
				endpoint: validation.data.subscription.endpoint,
				userId: session.user.id,
			},
		});

		let device: PushDevice;

		if (existingDevice) {
			device = await db.pushDevice.update({
				where: {
					id: existingDevice.id,
				},
				data: {
					endpoint: validation.data.subscription.endpoint,
					p256dh: validation.data.subscription.keys.p256dh,
					auth: validation.data.subscription.keys.auth,
					lastUsedAt: new Date(),
				},
			});
		} else {
			device = await db.pushDevice.create({
				data: {
					endpoint: validation.data.subscription.endpoint,
					p256dh: validation.data.subscription.keys.p256dh,
					auth: validation.data.subscription.keys.auth,
					userId: session.user.id,
					userAgent: headersList.get("user-agent") || undefined,
				},
			});
		}

		return createSuccessResponse(
			device,
			"Les notifications ont été activées avec succès"
		);
	} catch (error) {
		console.error("[PUSH_SUBSCRIBE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de l'activation des notifications"
		);
	}
}
