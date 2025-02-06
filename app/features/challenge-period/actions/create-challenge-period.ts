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
import { isGroupAdmin } from "../../groups/queries/is-group-admin";
import challengePeriodSchema from "../schemas/challenge-period-schema";

export default async function createChallengePeriod(
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
				"Vous devez être connecté pour créer une période"
			);
		}

		const rawData = {
			name: formData.get("name")?.toString() || "",
			startDate: formData.get("startDate")?.toString() || "",
			endDate: formData.get("endDate")?.toString() || "",
			groupId: formData.get("groupId")?.toString() || "",
			isActive: formData.get("isActive") === "true",
		};

		const validation = challengePeriodSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// Vérifier que le groupe existe
		const group = await db.group.findUnique({
			where: { id: validation.data.groupId },
		});

		if (!group) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Le groupe n'existe pas"
			);
		}

		// Vérifier que l'utilisateur est admin du groupe
		const isAdmin = await isGroupAdmin(validation.data.groupId);
		if (!isAdmin) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour créer une période dans ce groupe"
			);
		}

		const period = await db.challengePeriod.create({
			data: {
				name: validation.data.name,
				startDate: new Date(validation.data.startDate),
				endDate: new Date(validation.data.endDate),
				groupId: validation.data.groupId,
			},
		});

		revalidateTag(`group-${validation.data.groupId}`);
		revalidateTag(`periods-${validation.data.groupId}`);

		return createSuccessResponse(
			period,
			`La période ${period.name} a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_CHALLENGE_PERIOD]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer la période"
		);
	}
}
