import { getGroupInvites } from "@/app/entities/group-invites/queries/get-group-invites";
import GroupItem from "@/app/entities/groups/components/group-item";
import getGroups from "@/app/entities/groups/queries/get-groups";
import EmptyState from "@/components/empty-state";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Mail, Plus, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const groups = await getGroups({ search: "" });
	const invites = await getGroupInvites({ type: "received" });

	return (
		<PageContainer className="pb-32">
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
				{groups.length === 0 && (
					<EmptyState
						title="Aucun groupe trouvé"
						description="Vous n'appartenez à aucun groupe"
						icon={<Users className="h-8 w-8 text-muted-foreground/80" />}
					/>
				)}
				<div className="mt-4 flex flex-col gap-2.5">
					{groups.slice(0, 3).map((group) => (
						<GroupItem
							key={group.id}
							group={group}
							isOwner={group.ownerId === session?.user.id}
						/>
					))}
				</div>
			</div>
		</PageContainer>
	);
}
