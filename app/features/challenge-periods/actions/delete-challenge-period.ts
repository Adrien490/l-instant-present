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
import deleteChallengePeriodSchema from "../schemas/delete-challenge-period-schema";

export default async function deleteChallengePeriod(
	_: ServerActionState<
		ChallengePeriod,
		typeof deleteChallengePeriodSchema
	> | null,
	formData: FormData
): Promise<
	ServerActionState<ChallengePeriod, typeof deleteChallengePeriodSchema>
> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une période"
			);
		}

		const rawData = {
			id: formData.get("id")?.toString() || "",
			groupId: formData.get("groupId")?.toString() || "",
		};

		const validation = deleteChallengePeriodSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const existingPeriod = await db.challengePeriod.findUnique({
			where: { id: validation.data.id },
			include: {
				challenges: {
					select: { id: true },
				},
			},
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
				"Vous n'avez pas les droits pour supprimer cette période"
			);
		}

		// Vérifier s'il y a des défis associés
		if (existingPeriod.challenges.length > 0) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Cette période contient des défis et ne peut pas être supprimée"
			);
		}

		const period = await db.challengePeriod.delete({
			where: { id: validation.data.id },
		});

		revalidateTag(`group-${existingPeriod.groupId}`);
		revalidateTag(`periods-${existingPeriod.groupId}`);

		return createSuccessResponse(
			period,
			`La période ${period.name} a été supprimée avec succès`
		);
	} catch (error) {
		console.error("[DELETE_CHALLENGE_PERIOD]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer la période"
		);
	}
}
