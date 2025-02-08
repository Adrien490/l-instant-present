import GroupList from "@/app/features/groups/components/group-list";
import GroupListSkeleton from "@/app/features/groups/components/group-list-skeleton";
import getGroupList from "@/app/features/groups/queries/get-group-list";
import FloatingButton from "@/components/floating-button";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Crown, Plus, UserPlus, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	searchParams: Promise<{ search?: string; view?: string }>;
};

export default async function GroupsPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { search, view = "all" } = resolvedSearchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer className="pb-20">
			<PageHeader
				title="Groupes"
				description="Gérer vos groupes"
				showBackButton
				className="mb-4 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			/>

			<div className="flex flex-col gap-5">
				{/* Tabs Navigation */}
				<Tabs defaultValue={view} className="w-full">
					<TabsList className="w-full h-12 p-1 bg-muted/50 rounded-full grid grid-cols-3 gap-1">
						<TabsTrigger
							value="all"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link href={{ query: { ...resolvedSearchParams, view: "all" } }}>
								<Users className="h-4 w-4 mr-2" />
								Tous
							</Link>
						</TabsTrigger>
						<TabsTrigger
							value="joined"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link
								href={{ query: { ...resolvedSearchParams, view: "joined" } }}
							>
								<UserPlus className="h-4 w-4 mr-2" />
								Rejoints
							</Link>
						</TabsTrigger>
						<TabsTrigger
							value="owned"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link
								href={{ query: { ...resolvedSearchParams, view: "owned" } }}
							>
								<Crown className="h-4 w-4 mr-2" />
								Gérés
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Search Bar - Sticky on scroll */}
				<div className="sticky top-[72px] z-30 backdrop-blur py-2 -mx-4 px-4 bg-background/95">
					<div className="flex gap-3 items-center">
						<SearchForm paramName="search" placeholder="Rechercher un groupe" />
						<Button
							asChild
							size="icon"
							variant="secondary"
							className="h-11 w-11 rounded-full shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
						>
							<Link href="/app/groups/new">
								<Plus className="h-5 w-5" />
								<span className="sr-only">Créer un groupe</span>
							</Link>
						</Button>
					</div>
				</div>

				{/* Quick Stats Cards */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex gap-3 items-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50">
						<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
							<UserPlus className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Rejoints
							</p>
							<p className="text-2xl font-bold">12</p>
						</div>
					</div>

					<div className="flex gap-3 items-center p-4 rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-border/50">
						<div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
							<Crown className="h-5 w-5 text-secondary-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">Gérés</p>
							<p className="text-2xl font-bold">3</p>
						</div>
					</div>
				</div>

				{/* Groups List */}
				<section className="space-y-4 mt-2">
					<Suspense key={`${view}-${search}`} fallback={<GroupListSkeleton />}>
						<GroupList
							getGroupListPromise={getGroupList({
								search,
							})}
							sessionId={session.user.id}
							className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
						/>
					</Suspense>
				</section>

				{/* FAB - Create Group */}
				<FloatingButton
					href="/app/groups/new"
					label="Créer un groupe"
					variant="primary"
				>
					<Plus className="h-6 w-6" />
				</FloatingButton>
			</div>
		</PageContainer>
	);
}
