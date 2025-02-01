"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { authClient } from "@/lib/auth-client";
import { Bell, BellOff, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileActions() {
	const { permission, subscription, subscribe } = usePushNotifications();
	const router = useRouter();

	const onLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	return (
		<div className="space-y-4">
			<Card className="p-4">
				<h2 className="font-semibold mb-4">Notifications Push</h2>

				{permission === "denied" ? (
					<p className="text-sm text-muted-foreground">
						Les notifications sont bloquées. Veuillez les activer dans les
						paramètres de votre navigateur.
					</p>
				) : (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Button
								variant={subscription ? "outline" : "default"}
								onClick={subscribe}
								disabled={!!subscription}
							>
								{subscription ? (
									<>
										<BellOff className="h-4 w-4 mr-2" />
										Notifications activées
									</>
								) : (
									<>
										<Bell className="h-4 w-4 mr-2" />
										Activer les notifications
									</>
								)}
							</Button>
						</div>

						<p className="text-sm text-muted-foreground">
							{subscription
								? "Vous recevrez des notifications pour les nouveaux défis et validations."
								: "Activez les notifications pour être informé des nouveaux défis et validations."}
						</p>
					</div>
				)}
			</Card>

			<Card className="p-4">
				<h2 className="font-semibold mb-4">Actions</h2>
				<Button variant="destructive" onClick={onLogout} className="w-full">
					<LogOut className="h-4 w-4 mr-2" />
					Se déconnecter
				</Button>
			</Card>
		</div>
	);
}
