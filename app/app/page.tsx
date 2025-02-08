import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { CalendarDays, Plus, Trophy, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import GroupList from "../features/groups/components/group-list";
import GroupListSkeleton from "../features/groups/components/group-list-skeleton";
import getGroupList from "../features/groups/queries/get-group-list";
import UserAvatar from "../features/users/components/user-avatar";

type Props = {
	searchParams: Promise<{ search?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { search } = resolvedSearchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer className="pb-20">
			{/* Header avec avatar et notifications */}
			<div className="flex items-center justify-between mb-6">
				<PageHeader
					title={
						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground font-medium">
								Bonjour,
							</span>
							<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
								{session.user.name}
							</span>
						</div>
					}
				/>
				<Suspense>
					<UserAvatar />
				</Suspense>
			</div>

			<div className="flex flex-col gap-8">
				{/* Quick Actions Grid */}
				<div className="grid grid-cols-2 gap-4">
					<Link
						href="/app/groups/new"
						className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 shadow-lg border border-border/50 active:scale-[0.98] transition-all duration-200"
					>
						<div className="relative z-10 flex flex-col h-[120px] justify-between">
							<div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
								<Plus className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">
									Nouveau groupe
								</h3>
								<p className="text-sm text-muted-foreground">Créer un groupe</p>
							</div>
						</div>
						<div className="absolute -bottom-6 -right-6 transform">
							<Users className="h-32 w-32 rotate-12 text-primary opacity-[0.07] transition-transform duration-200 group-hover:scale-110" />
						</div>
					</Link>

					<Link
						href="/app/invites"
						className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent p-4 shadow-lg border border-border/50 active:scale-[0.98] transition-all duration-200"
					>
						<div className="relative z-10 flex flex-col h-[120px] justify-between">
							<div className="h-8 w-8 rounded-2xl bg-secondary/10 flex items-center justify-center">
								<Trophy className="h-5 w-5 text-secondary-foreground" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Invitations</h3>
								<p className="text-sm text-muted-foreground">
									Gérer les invitations
								</p>
							</div>
						</div>
						<div className="absolute -bottom-6 -right-6 transform">
							<CalendarDays className="h-32 w-32 rotate-12 text-secondary-foreground opacity-[0.07] transition-transform duration-200 group-hover:scale-110" />
						</div>
					</Link>
				</div>

				{/* Recent Groups Section */}
				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold">Groupes récents</h2>
							<p className="text-sm text-muted-foreground">
								Vos 3 derniers groupes
							</p>
						</div>
						<Button variant="ghost" size="sm" asChild className="font-medium">
							<Link
								href="/app/groups"
								className="text-primary hover:text-primary/80"
							>
								Voir tout
							</Link>
						</Button>
					</div>

					<Suspense fallback={<GroupListSkeleton />}>
						<GroupList
							getGroupListPromise={getGroupList({
								search,
								take: 3,
							})}
							sessionId={session.user.id}
							className="flex flex-col gap-3"
						/>
					</Suspense>
				</section>
			</div>
		</PageContainer>
	);
}
