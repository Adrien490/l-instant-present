import { PushNotificationManager } from "@/app/components/push-notification-manager";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { getUserInitials } from "@/lib/utils";
import { headers } from "next/headers";
import ProfileActions from "./profile-actions";

export default async function ProfilePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const user = session?.user;

	return (
		<PageContainer>
			<PageHeader
				title="Profil"
				description="Gérez vos informations personnelles"
				userPromise={Promise.resolve(user ?? null)}
			/>
			<div className="p-4">
				<div className="max-w-2xl mx-auto">
					<div className="space-y-6">
						<div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
							<Avatar className="w-20 h-20 mb-4">
								<AvatarImage
									src={user?.image || undefined}
									alt={user?.name || "Avatar de l'utilisateur"}
								/>
								<AvatarFallback className="text-xl">
									{getUserInitials(user?.name, user?.email)}
								</AvatarFallback>
							</Avatar>
							<h2 className="text-xl font-semibold">
								{user?.name || "Utilisateur"}
							</h2>
							<p className="text-sm text-muted-foreground">{user?.email}</p>
						</div>
						<ProfileActions />
					</div>
				</div>
			</div>
			<PushNotificationManager />
		</PageContainer>
	);
}
