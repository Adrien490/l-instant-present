"use client";

import { usePushNotifications } from "@/app/hooks/use-push-notifications";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function PushNotificationButton() {
	const {
		isSupported,
		isLoading,
		subscription,
		permission,
		subscribe,
		unsubscribe,
	} = usePushNotifications();

	if (!isSupported) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="flex items-center space-x-2 opacity-50">
				<Loader2 className="h-4 w-4 animate-spin" />
				<Label className="text-sm text-muted-foreground">Chargement...</Label>
			</div>
		);
	}

	const handleToggle = async () => {
		if (subscription) {
			await unsubscribe();
		} else {
			await subscribe();
		}
	};

	if (permission === "denied") {
		return (
			<div className="flex items-center space-x-2">
				<Switch disabled checked={false} />
				<div className="grid gap-1.5">
					<Label className="text-sm font-medium">Notifications</Label>
					<p className="text-xs text-muted-foreground">
						Notifications bloquées. Veuillez modifier les paramètres de votre
						navigateur.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="notifications"
				checked={!!subscription}
				onCheckedChange={handleToggle}
			/>
			<div className="grid gap-1.5">
				<Label htmlFor="notifications" className="text-sm font-medium">
					Notifications
				</Label>
				<p className="text-xs text-muted-foreground">
					{subscription
						? "Vous recevrez des notifications pour les nouveaux événements."
						: "Activez les notifications pour rester informé."}
				</p>
			</div>
		</div>
	);
}
