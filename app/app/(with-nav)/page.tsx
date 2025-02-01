import { getUserInvites } from "@/app/server/group-invites/queries/get-user-invites";
import getGroups from "@/app/server/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Mail, Plus, UserPlus, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const groups = await getGroups({ search: "" });
	const invites = await getUserInvites();

	return (
		<PageContainer className="pb-20">
			{/* Hero Section */}
			<PageHeader
				title={`Bonjour ${session?.user.name?.split(" ")[0]} 👋`}
				description="Découvrez les groupes auxquels vous appartenez et gérez vos invitations."
			/>

			{/* Quick Actions */}
			<div className="mt-4">
				<div className="grid grid-cols-2 gap-2">
					<Link href="/app/my-groups/new">
						<Card className="flex h-24 flex-col items-center justify-center gap-1.5 p-2 transition-colors hover:bg-muted/50">
							<div className="rounded-full bg-primary/10 p-2">
								<Plus className="h-5 w-5 text-primary" />
							</div>
							<span className="text-xs font-medium text-center">
								Créer un groupe
							</span>
						</Card>
					</Link>
					<Link href="/app/my-groups">
						<Card className="flex h-24 flex-col items-center justify-center gap-1.5 p-2 transition-colors hover:bg-muted/50">
							<div className="rounded-full bg-primary/10 p-2">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<span className="text-xs font-medium text-center">
								Mes groupes
							</span>
						</Card>
					</Link>
				</div>
			</div>

			{/* Pending Invites */}
			{invites.length > 0 && (
				<div className="mt-6">
					<div className="flex items-center justify-between">
						<h2 className="text-base font-semibold">Invitations en attente</h2>
					</div>
					<div className="mt-3 space-y-2">
						{invites.map((invite) => (
							<Link key={invite.id} href={`/app/invites/${invite.id}`}>
								<Card className="p-3 transition-colors hover:bg-muted/50">
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-primary/10 p-2">
											<Mail className="h-4 w-4 text-primary" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium truncate">
												{invite.group.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{invite.group.members.length} membres
											</p>
										</div>
									</div>
								</Card>
							</Link>
						))}
					</div>
				</div>
			)}

			{/* My Groups */}
			<div className="mt-6">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-semibold">Groupes récents</h2>
					{groups.length > 0 && (
						<Button variant="ghost" size="sm" className="text-xs" asChild>
							<Link href="/app/my-groups">Voir tous mes groupes</Link>
						</Button>
					)}
				</div>
				<div className="mt-3 space-y-2">
					{groups.slice(0, 3).map((group) => (
						<Link key={group.id} href={`/app/groups/${group.id}`}>
							<Card className="p-3 transition-colors hover:bg-muted/50">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-primary/10 p-2">
										<Users className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium truncate">{group.name}</p>
										<p className="text-xs text-muted-foreground">
											{group.members.length} membres
										</p>
									</div>
								</div>
							</Card>
						</Link>
					))}

					{groups.length === 0 && (
						<Card className="flex flex-col items-center text-center p-6 gap-4">
							<div className="rounded-full bg-primary/10 p-3">
								<UserPlus className="h-6 w-6 text-primary" />
							</div>
							<div className="space-y-1">
								<h3 className="text-sm font-medium">
									Vous n&apos;avez pas encore de groupe
								</h3>
								<p className="text-xs text-muted-foreground px-4">
									Créez votre premier groupe ou attendez une invitation
								</p>
							</div>
							<Button size="sm" className="w-full" asChild>
								<Link href="/app/my-groups/new">
									<Plus className="h-4 w-4 mr-1.5" />
									Créer un groupe
								</Link>
							</Button>
						</Card>
					)}
				</div>
			</div>
		</PageContainer>
	);
}
