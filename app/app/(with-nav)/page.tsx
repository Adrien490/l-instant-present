import GroupInviteItem from "@/app/entities/group-invites/components/group-invite-item";
import { getGroupInvites } from "@/app/entities/group-invites/queries/get-group-invites";
import GroupList from "@/app/entities/groups/components/group-list";
import getGroups from "@/app/entities/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Plus, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const [groups, firstThreeGroups, invites, firstTwoInvites] =
		await Promise.all([
			getGroups({ search: "" }),
			getGroups({ search: "", take: 3 }),
			getGroupInvites({ type: "received" }),
			getGroupInvites({ type: "received", take: 2 }),
		]);

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer className="pb-32">
			{/* Hero Section */}
			<PageHeader
				title={`Bonjour ${session.user.name?.split(" ")[0]} 👋`}
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
							<span className="text-sm font-medium text-center">
								Créer un groupe
							</span>
						</Card>
					</Link>
					<Link href="/app/my-groups">
						<Card className="flex h-24 flex-col items-center justify-center gap-1.5 p-2 transition-colors hover:bg-muted/50">
							<div className="rounded-full bg-primary/10 p-2">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<span className="text-sm font-medium text-center">
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
						<h2 className="text-lg font-semibold">Invitations en attente</h2>
					</div>
					<div className="mt-4 space-y-3">
						{firstTwoInvites.map((invite) => (
							<GroupInviteItem
								key={invite.id}
								invite={invite}
								type="received"
							/>
						))}
						{invites.length === 2 && (
							<Link href="/app/invites">
								<Card className="flex items-center justify-center gap-3 p-4 text-base text-muted-foreground transition-colors hover:bg-muted/50 active:bg-muted">
									<span>Voir toutes les invitations</span>
									<span className="text-sm">•</span>
									<span className="text-sm">Voir tout</span>
								</Card>
							</Link>
						)}
					</div>
				</div>
			)}

			{/* My Groups */}
			<div className="mt-6">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Groupes récents</h2>
					{groups.length > 0 && (
						<Button variant="ghost" size="sm" className="text-sm" asChild>
							<Link href="/app/my-groups">Voir tous mes groupes</Link>
						</Button>
					)}
				</div>
				<GroupList
					groups={firstThreeGroups}
					sessionId={session.user.id}
					className="mt-4 mb-4"
				/>
				{groups.length > 3 && (
					<Link href="/app/my-groups">
						<Card className="flex items-center justify-center gap-3 p-4 text-base text-muted-foreground transition-colors hover:bg-muted/50 active:bg-muted">
							<span>+{groups.length - 3} autres groupes</span>
							<span className="text-sm">•</span>
							<span className="text-sm">Voir tout</span>
						</Card>
					</Link>
				)}
			</div>
		</PageContainer>
	);
}
