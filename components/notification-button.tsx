"use client";

import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Bell } from "lucide-react";

export function NotificationButton() {
	const { permission, subscription, subscribe } = usePushNotifications();

	if (permission === "denied") return null;

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={subscribe}
			disabled={!!subscription}
			title="Activer les notifications"
		>
			<Bell className="h-5 w-5" />
		</Button>
	);
}
