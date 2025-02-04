import PushNotificationButton from "@/app/features/push-notifications/components/push-notification-button";
import LogoutButton from "@/app/features/users/components/logout-button";
import getUser from "@/app/features/users/queries/get-user";
import PageContainer from "@/components/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatDateToFrench, getUserInitials } from "@/lib/utils";
import {
	CalendarDays,
	Group,
	Mail,
	Pencil,
	Shield,
	Trophy,
	User,
	Waves,
} from "lucide-react";
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
	const session = await auth.api.getSession({ headers: await headers() });

	if (!user) {
		return notFound();
	}

	const isCurrentUser = session?.user?.id === user.id;

	return (
		<PageContainer>
			<div className="max-w-4xl mx-auto py-8 space-y-8">
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
									Membre depuis {formatDateToFrench(user.createdAt)}
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
					{/* Statistiques */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-primary" />
								Statistiques
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
									<p className="text-2xl font-bold text-primary">
										{user.ownedGroups.length}
									</p>
									<p className="text-sm text-muted-foreground">Groupes créés</p>
								</div>
								<div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
									<p className="text-2xl font-bold text-primary">
										{user.memberships.length}
									</p>
									<p className="text-sm text-muted-foreground">
										Participations
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Groupes */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Group className="h-5 w-5 text-primary" />
								Groupes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{user.ownedGroups.length > 0 && (
									<div>
										<h3 className="text-sm font-medium mb-3 flex items-center gap-2">
											<User className="h-4 w-4" />
											Groupes créés
										</h3>
										<div className="space-y-2">
											{user.ownedGroups.map((group) => (
												<div
													key={group.id}
													className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
												>
													<Avatar className="h-8 w-8 border border-border">
														<AvatarImage src={group.imageUrl || undefined} />
														<AvatarFallback className="bg-primary/10">
															{getUserInitials(group.name, "")}
														</AvatarFallback>
													</Avatar>
													<span className="font-medium">{group.name}</span>
												</div>
											))}
										</div>
									</div>
								)}
								{user.memberships.length > 0 && (
									<div>
										<h3 className="text-sm font-medium mb-3 flex items-center gap-2">
											<Group className="h-4 w-4" />
											Membre de
										</h3>
										<div className="space-y-2">
											{user.memberships.map((membership) => (
												<div
													key={membership.group.id}
													className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
												>
													<Avatar className="h-8 w-8 border border-border">
														<AvatarImage
															src={membership.group.imageUrl || undefined}
														/>
														<AvatarFallback className="bg-primary/10">
															{getUserInitials(membership.group.name, "")}
														</AvatarFallback>
													</Avatar>
													<span className="font-medium">
														{membership.group.name}
													</span>
													<Badge
														variant="secondary"
														className="ml-auto text-xs capitalize"
													>
														{membership.role.toLowerCase()}
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}
								{user.ownedGroups.length === 0 &&
									user.memberships.length === 0 && (
										<div className="text-center py-8">
											<Group className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
											<p className="text-sm text-muted-foreground">
												Aucun groupe pour le moment
											</p>
										</div>
									)}
							</div>
						</CardContent>
					</Card>

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
