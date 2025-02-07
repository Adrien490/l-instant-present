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
import { ChallengePeriod } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import isGroupAdmin from "../../groups/lib/is-group-admin";
import challengePeriodSchema from "../schemas/challenge-period-schema";

export default async function editChallengePeriod(
	_: ServerActionState<ChallengePeriod, typeof challengePeriodSchema> | null,
	formData: FormData
): Promise<ServerActionState<ChallengePeriod, typeof challengePeriodSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier cette période"
			);
		}

		const periodId = formData.get("id")?.toString();
		if (!periodId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'identifiant de la période est manquant"
			);
		}

		const existingPeriod = await db.challengePeriod.findUnique({
			where: { id: periodId },
		});

		if (!existingPeriod) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Cette période n'existe pas"
			);
		}

		// Vérifier que le groupe existe
		const group = await db.group.findUnique({
			where: { id: existingPeriod.groupId },
		});

		if (!group) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Le groupe n'existe pas"
			);
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(existingPeriod.groupId);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour modifier cette période"
			);
		}

		const rawData = {
			id: periodId,
			name: formData.get("name")?.toString() || "",
			startDate: formData.get("startDate")?.toString() || "",
			endDate: formData.get("endDate")?.toString() || "",
			groupId: existingPeriod.groupId,
		};

		const validation = challengePeriodSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const period = await db.challengePeriod.update({
			where: { id: periodId },
			data: {
				name: validation.data.name,
				startDate: new Date(validation.data.startDate),
				endDate: new Date(validation.data.endDate),
			},
		});

		revalidateTag(`group-${existingPeriod.groupId}`);
		revalidateTag(`periods-${existingPeriod.groupId}`);
		revalidateTag(`period-${periodId}`);

		return createSuccessResponse(
			period,
			`La période ${period.name} a été modifiée avec succès`
		);
	} catch (error) {
		console.error("[EDIT_CHALLENGE_PERIOD]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier la période"
		);
	}
}
