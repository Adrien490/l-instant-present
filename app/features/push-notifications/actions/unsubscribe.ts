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
import unsubscribeSchema from "../schemas/unsubscribe-schema";

export default async function unsubscribe(
	_: ServerActionState<PushDevice | null, typeof unsubscribeSchema> | null,
	formData: FormData
): Promise<ServerActionState<PushDevice | null, typeof unsubscribeSchema>> {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});

		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour désactiver les notifications"
			);
		}

		const rawData = {
			endpoint: formData.get("endpoint")?.toString() || "",
		};

		const validation = unsubscribeSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const device = await db.pushDevice.findFirst({
			where: {
				endpoint: validation.data.endpoint,
				userId: session.user.id,
			},
		});

		await db.pushDevice.deleteMany({
			where: {
				endpoint: validation.data.endpoint,
				userId: session.user.id,
			},
		});

		return createSuccessResponse(
			device,
			"Les notifications ont été désactivées avec succès"
		);
	} catch (error) {
		console.error("[PUSH_UNSUBSCRIBE]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Une erreur est survenue lors de la désactivation des notifications"
		);
	}
}
