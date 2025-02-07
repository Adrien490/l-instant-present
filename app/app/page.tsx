import GroupList from "@/app/features/groups/components/group-list";
import GroupListSkeleton from "@/app/features/groups/components/group-list-skeleton";
import getGroupList from "@/app/features/groups/queries/get-group-list";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	searchParams: Promise<{
		search: string;
	}>;
};

export default async function HomePage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { search } = resolvedSearchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer>
			<PageHeader
				title={`Bonjour ${session.user.name?.split(" ")[0]} 👋`}
				description="Bienvenue sur l'instant présent"
				actions={
					<Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
						<UserAvatar className="h-10 w-10 md:h-12 md:w-12" />
					</Suspense>
				}
			/>
			<div className="flex flex-col gap-3">
				{/* Search and Create Group */}
				<div className="flex flex-col gap-3 md:flex-row md:items-center">
					<SearchForm
						paramName="search"
						placeholder="Rechercher ..."
						className="w-full"
					/>
					<Button asChild size="lg" className="w-full md:w-auto">
						<Link
							href="/app/my-groups/new"
							className="flex items-center justify-center"
						>
							<Users className="mr-2 h-5 w-5" />
							Créer un groupe
						</Link>
					</Button>
				</div>

				{/* Recent Groups Section */}
				<section className="mt-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-base font-semibold md:text-lg">
							Groupes récents
						</h2>

						<Button
							variant="ghost"
							size="sm"
							className="text-sm touch-target-2025 -mr-2"
							asChild
						>
							<Link href="/app/my-groups">Voir tout</Link>
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
