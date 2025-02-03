import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Vous devez être connecté pour activer les notifications" },
				{ status: 401 }
			);
		}

		const subscription = await request.json();

		const existingDevice = await db.pushDevice.findUnique({
			where: {
				endpoint: subscription.endpoint,
				userId: session.user.id,
			},
		});

		if (existingDevice) {
			await db.pushDevice.update({
				where: {
					id: existingDevice.id,
				},
				data: {
					endpoint: subscription.endpoint,
					p256dh: subscription.keys.p256dh,
					auth: subscription.keys.auth,
				},
			});
		} else {
			await db.pushDevice.create({
				data: {
					endpoint: subscription.endpoint,
					p256dh: subscription.keys.p256dh,
					auth: subscription.keys.auth,
					userId: session.user.id,
				},
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[PUSH_NOTIFICATIONS] Subscribe failed:", error);
		return NextResponse.json(
			{
				error: "Une erreur est survenue lors de l'activation des notifications",
			},
			{ status: 500 }
		);
	}
}
