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
	searchParams: Promise<{ search?: string; filter?: string }>;
};

export default async function GroupsPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { search, filter = "all" } = resolvedSearchParams;
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
				<Tabs defaultValue={filter} className="w-full">
					<TabsList className="w-full h-12 p-1 bg-muted/50 rounded-full grid grid-cols-3 gap-1">
						<TabsTrigger
							value="all"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link
								replace
								href={{
									query: {
										...resolvedSearchParams,
										filter: "all",
									},
								}}
							>
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
								replace
								href={{
									query: {
										...resolvedSearchParams,
										filter: "joined",
									},
								}}
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
								replace
								href={{
									query: {
										...resolvedSearchParams,
										filter: "owned",
									},
								}}
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

				{/* Groups List */}
				<section className="space-y-4 mt-2">
					<Suspense
						key={`${filter}-${search}`}
						fallback={<GroupListSkeleton />}
					>
						<GroupList
							getGroupListPromise={getGroupList({
								search,
								filter: filter as "all" | "joined" | "owned",
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
