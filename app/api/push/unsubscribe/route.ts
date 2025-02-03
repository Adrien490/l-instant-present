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
				{ error: "Vous devez être connecté pour désactiver les notifications" },
				{ status: 401 }
			);
		}

		const { endpoint } = await request.json();

		await db.pushDevice.deleteMany({
			where: {
				endpoint,
				userId: session.user.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[PUSH_UNSUBSCRIBE]", error);
		return NextResponse.json(
			{
				error:
					"Une erreur est survenue lors de la désactivation des notifications",
			},
			{ status: 500 }
		);
	}
}
