import PushNotificationButton from "@/app/features/push-notifications/components/push-notification-button";
import LogoutButton from "@/app/features/users/components/logout-button";
import getUserInitials from "@/app/features/users/lib/get-user-initials";
import getUser from "@/app/features/users/queries/get-user";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { CalendarDays, Mail, Pencil, Shield, Waves } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		userId: string;
	}>;
};

export default async function ProfilePage({ params }: Props) {
	const resolvedParams = await params;
	const { userId } = resolvedParams;

	const user = await getUser({ id: userId });

	if (!user) {
		return notFound();
	}

	const session = await auth.api.getSession({ headers: await headers() });

	const isCurrentUser = session?.user?.id === user.id;

	return (
		<PageContainer>
			<PageHeader
				title={`Profil de ${user.name}`}
				description="Voir les informations de l'utilisateur"
				showBackButton
			/>
			<div className="mx-auto space-y-8">
				{/* En-tête du profil */}
				<Card className="relative overflow-hidden">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center space-y-4">
							<div className="relative">
								<Avatar className="w-24 h-24 border-4 border-background shadow-xl">
									<AvatarImage
										src={user?.image || undefined}
										alt={user?.name || "Avatar de l'utilisateur"}
									/>
									<AvatarFallback className="text-2xl bg-primary/10">
										{getUserInitials(user?.name || "", user?.email || "")}
									</AvatarFallback>
								</Avatar>
								{isCurrentUser && (
									<Badge className="absolute -top-2 -right-2 px-2">
										<Shield className="w-3 h-3 mr-1" />
										Vous
									</Badge>
								)}
							</div>
							<div className="space-y-2">
								<h1 className="text-2xl font-bold flex items-center justify-center gap-2">
									{user?.name || "Utilisateur"}
									<Waves className="h-5 w-5 text-primary" />
								</h1>
								<div className="flex items-center justify-center gap-2 text-muted-foreground">
									<Mail className="h-4 w-4" />
									<span>{user?.email}</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Membre depuis{" "}
									{user.createdAt
										? new Date(user.createdAt).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "long",
												day: "numeric",
										  })
										: "date inconnue"}
								</p>
								{isCurrentUser && (
									<Button variant="outline" size="sm" className="mt-4" asChild>
										<Link href={`/app/profile/${user.id}/edit`}>
											<Pencil className="h-4 w-4 mr-2" />
											Modifier mon profil
										</Link>
									</Button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					{/* Actions et paramètres */}
					{isCurrentUser && (
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
					)}
				</div>
			</div>
		</PageContainer>
	);
}
