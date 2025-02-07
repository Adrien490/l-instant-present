import ChallengePeriodList from "@/app/features/challenge-periods/components/challenge-period-list";
import getChallengePeriodList from "@/app/features/challenge-periods/queries/get-challenge-period-list";
import { getGroup } from "@/app/features/groups/queries/get-group";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
	params: Promise<{ groupId: string }>;
	searchParams: Promise<{ search?: string }>;
};

export default async function ChallengePeriodsPage({
	params,
	searchParams,
}: Props) {
	const resolvedParams = await params;
	const { groupId } = resolvedParams;
	const resolvedSearchParams = await searchParams;
	const search = resolvedSearchParams.search;

	const group = await getGroup({ id: groupId });

	if (!group) {
		notFound();
	}

	return (
		<PageContainer>
			<PageHeader
				showBackButton
				title={group.name}
				description="Gérer les périodes de challenges"
				actions={
					<Button size="sm" variant="outline">
						<Settings className="h-5 w-5" />
					</Button>
				}
			/>
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
							href={`/app/groups/${groupId}/challenge-periods/new`}
							className="flex items-center justify-center"
						>
							<Calendar className="mr-2 h-5 w-5" />
							Créer une nouvelle période
						</Link>
					</Button>
				</div>

				{/* Recent Groups Section */}
				<section className="mt-3 md:mt-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-base font-semibold md:text-lg">Mes groupes</h2>
					</div>

					<Suspense fallback={<div>Loading...</div>}>
						<ChallengePeriodList
							groupId={groupId}
							getChallengePeriodListPromise={getChallengePeriodList({
								groupId,
								search,
							})}
						/>
					</Suspense>
				</section>
			</div>
		</PageContainer>
	);
}
