import GroupInviteList from "@/app/features/group-invites/components/group-invite-list";
import getGroupInvites from "@/app/features/group-invites/queries/get-group-invite-list";
import GroupList from "@/app/features/groups/components/group-list";
import GroupListSkeleton from "@/app/features/groups/components/group-list-skeleton";
import getGroupList from "@/app/features/groups/queries/get-group-list";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { GroupInviteStatus } from "@prisma/client";
import { Plus, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user.id) {
		return null;
	}

	const [invites, firstTwoInvites] = await Promise.all([
		getGroupInvites({ type: "received", status: GroupInviteStatus.PENDING }),
		getGroupInvites({
			type: "received",
			status: GroupInviteStatus.PENDING,
			take: 2,
		}),
	]);

	return (
		<PageContainer className="pb-32">
			{/* Hero Section */}
			<PageHeader
				title={`Bonjour ${session.user.name?.split(" ")[0]} 👋`}
				description="Découvrez les groupes auxquels vous appartenez et gérez vos invitations."
			/>

			{/* Quick Actions */}
			<div className="mt-4">
				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					<Link href="/app/my-groups/new">
						<Card className="group flex h-[4.5rem] sm:h-20 items-center gap-3 p-3 sm:p-4 transition-all hover:bg-muted/50 active:bg-muted transform-gpu">
							<div className="rounded-full bg-primary/10 p-2">
								<Plus className="h-5 w-5 text-primary transform-gpu" />
							</div>
							<span className="text-sm sm:text-base leading-tight sm:leading-normal font-medium text-left">
								Créer un groupe
							</span>
						</Card>
					</Link>
					<Link href="/app/my-groups">
						<Card className="group flex h-[4.5rem] sm:h-20 items-center gap-3 p-3 sm:p-4 transition-all hover:bg-muted/50 active:bg-muted transform-gpu">
							<div className="rounded-full bg-primary/10 p-2">
								<Users className="h-5 w-5 text-primary transform-gpu" />
							</div>
							<span className="text-sm sm:text-base leading-tight sm:leading-normal font-medium text-left">
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
						<h2 className="text-lg font-medium leading-tight tracking-tight md:tracking-normal antialiased">
							Invitations en attente
						</h2>
					</div>

					<GroupInviteList
						className="mt-6 flex flex-col gap-4"
						invites={firstTwoInvites}
						type="received"
					/>
					{invites.length === 2 && (
						<Link href="/app/invites">
							<Card className="flex items-center justify-center gap-3 p-4 transition-all hover:bg-muted/50 active:bg-muted transform-gpu">
								<span className="text-base leading-normal antialiased text-muted-foreground">
									Voir toutes les invitations
								</span>
								<span className="text-sm antialiased">•</span>
								<span className="text-sm leading-normal antialiased">
									Voir tout
								</span>
							</Card>
						</Link>
					)}
				</div>
			)}

			{/* My Groups */}
			<div className="mt-6 spacing-2025-compact">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium leading-tight tracking-tight md:tracking-normal antialiased">
						Groupes récents
					</h2>

					<Button
						variant="ghost"
						size="sm"
						className="text-sm leading-normal antialiased touch-target-2025"
						asChild
					>
						<Link href="/app/my-groups">Voir tous mes groupes</Link>
					</Button>
				</div>

				<Suspense fallback={<GroupListSkeleton />}>
					<GroupList
						getGroupListPromise={getGroupList({ search: "", take: 3 })}
						sessionId={session.user.id}
						className="mt-4 mb-4 flex flex-col gap-4"
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
