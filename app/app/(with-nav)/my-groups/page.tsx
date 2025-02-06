import GroupList from "@/app/features/groups/components/group-list";
import GroupListSkeleton from "@/app/features/groups/components/group-list-skeleton";
import getGroupList from "@/app/features/groups/queries/get-group-list";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
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

export default async function MyGroupsPage({ searchParams }: Props) {
	const session = await auth.api.getSession({ headers: await headers() });
	const resolvedSearchParams = await searchParams;

	return (
		<PageContainer className="pb-32">
			<PageHeader
				title="Mes groupes"
				description="Découvrez tous les groupes auxquels vous appartenez."
			/>
			<div className="flex flex-col gap-4 sm:gap-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<SearchForm
						paramName="search"
						placeholder="Rechercher ..."
						className="w-full"
					/>
					<Button
						asChild
						size="lg"
						className="w-full sm:w-auto touch-target-2025 min-h-[44px] font-medium text-base leading-normal antialiased"
					>
						<Link href="/app/my-groups/new">
							<Users className="mr-3 h-5 w-5 transform-gpu" />
							Créer un groupe
						</Link>
					</Button>
				</div>

				<Suspense fallback={<GroupListSkeleton />}>
					<GroupList
						getGroupListPromise={getGroupList({
							search: resolvedSearchParams.search,
						})}
						sessionId={session?.user.id ?? ""}
						className="flex flex-col gap-2"
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
