"use client";

import PushNotificationButton from "@/app/features/push-notifications/components/push-notification-button";
import LogoutButton from "@/app/features/users/components/logout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function ProfileSettings() {
	return (
		<Card className="md:col-span-2">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CalendarDays className="h-5 w-5 text-primary" />
					Paramètres
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-8 md:grid-cols-2">
					<div className="space-y-2">
						<h3 className="text-sm font-medium flex items-center gap-2">
							Notifications
						</h3>
						<PushNotificationButton />
					</div>
					<div className="space-y-2">
						<h3 className="text-sm font-medium flex items-center gap-2">
							Session
						</h3>
						<LogoutButton>
							<Button
								variant="outline"
								className="w-full hover:bg-destructive hover:text-destructive-foreground"
							>
								Se déconnecter
							</Button>
						</LogoutButton>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
