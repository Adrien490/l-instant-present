import PageContainer from "@/components/page-container";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	CalendarDays,
	Group,
	Mail,
	Shield,
	Trophy,
	User,
	Waves,
} from "lucide-react";

export default function LoadingProfilePage() {
	return (
		<PageContainer>
			<div className="max-w-4xl mx-auto py-8 space-y-8">
				{/* En-tête du profil */}
				<Card className="relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background" />
					<CardContent className="pt-6 relative">
						<div className="flex flex-col items-center text-center space-y-4">
							<div className="relative">
								<Avatar className="w-24 h-24 border-4 border-background shadow-xl">
									<div className="w-full h-full bg-muted animate-pulse" />
								</Avatar>
								<Badge className="absolute -top-2 -right-2 px-2">
									<Shield className="w-3 h-3 mr-1" />
									Vous
								</Badge>
							</div>
							<div className="space-y-2">
								<h1 className="flex items-center justify-center gap-2">
									<Skeleton className="h-8 w-48" />
									<Waves className="h-5 w-5 text-primary" />
								</h1>
								<div className="flex items-center justify-center gap-2 text-muted-foreground">
									<Mail className="h-4 w-4" />
									<Skeleton className="h-4 w-40" />
								</div>
								<Skeleton className="h-4 w-48 mx-auto" />
								<Skeleton className="h-9 w-40 mx-auto mt-4" />
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
									<Skeleton className="h-8 w-8 mx-auto" />
									<Skeleton className="h-4 w-24 mx-auto" />
								</div>
								<div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
									<Skeleton className="h-8 w-8 mx-auto" />
									<Skeleton className="h-4 w-24 mx-auto" />
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
								<div>
									<h3 className="text-sm font-medium mb-3 flex items-center gap-2">
										<User className="h-4 w-4" />
										Groupes créés
									</h3>
									<div className="space-y-2">
										{[1, 2].map((i) => (
											<div
												key={i}
												className="flex items-center gap-3 p-2 rounded-lg"
											>
												<Skeleton className="h-8 w-8 rounded-full" />
												<Skeleton className="h-4 w-32" />
											</div>
										))}
									</div>
								</div>
								<div>
									<h3 className="text-sm font-medium mb-3 flex items-center gap-2">
										<Group className="h-4 w-4" />
										Membre de
									</h3>
									<div className="space-y-2">
										{[1, 2].map((i) => (
											<div
												key={i}
												className="flex items-center gap-3 p-2 rounded-lg"
											>
												<Skeleton className="h-8 w-8 rounded-full" />
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-5 w-16 ml-auto" />
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions et paramètres */}
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
									<Skeleton className="h-14 w-full" />
								</div>
								<div className="space-y-2">
									<h3 className="text-sm font-medium flex items-center gap-2">
										Session
									</h3>
									<Button variant="outline" className="w-full h-10" disabled>
										Se déconnecter
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageContainer>
	);
}
