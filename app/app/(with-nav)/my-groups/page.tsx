import getGroups from "@/app/server/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import GroupList from "./components/group-list";

type Props = {
	searchParams: Promise<{
		search: string;
	}>;
};

export default async function MyGroupsPage({ searchParams }: Props) {
	const session = await auth.api.getSession({ headers: await headers() });
	const resolvedSearchParams = await searchParams;
	const groups = await getGroups({
		search: resolvedSearchParams.search,
	});

	return (
		<PageContainer className="pb-20">
			<PageHeader
				title="Mes groupes"
				description="Découvrez tous les groupes auxquels vous appartenez."
			/>
			<div className="flex items-center gap-2">
				<SearchForm paramName="search" placeholder="Rechercher ..." />
				<Link href="/app/my-groups/new">
					<Button>Créer un groupe</Button>
				</Link>
			</div>
			<GroupList groups={groups} userId={session?.user.id} />
		</PageContainer>
	);
}
