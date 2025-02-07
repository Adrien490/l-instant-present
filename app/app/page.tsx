import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import GroupList from "../features/groups/components/group-list";
import GroupListSkeleton from "../features/groups/components/group-list-skeleton";
import getGroupList from "../features/groups/queries/get-group-list";

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
		<>
			<PageHeader title="Mes groupes" description="Gérer vos groupes" />
			<PageContainer>
				<div className="flex flex-col gap-3">
					{/* Search and Create Group */}
					<div className="flex flex-col gap-2 md:flex-row md:items-center">
						<SearchForm
							paramName="search"
							placeholder="Rechercher ..."
							className="w-full"
						/>
						<Button asChild size="lg" className="w-full h-11 md:w-auto md:h-12">
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
					<section className="mt-3 md:mt-4">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-base font-semibold md:text-lg">
								Groupes récents
							</h2>

							<Button
								variant="ghost"
								size="sm"
								className="text-sm -mr-2 h-9"
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
								className="flex flex-col gap-2.5"
							/>
						</Suspense>
					</section>
				</div>
			</PageContainer>
		</>
	);
}
