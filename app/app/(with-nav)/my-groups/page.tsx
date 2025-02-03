import GroupList from "@/app/entities/groups/components/group-list";
import getGroups from "@/app/entities/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

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

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer className="pb-32">
			<PageHeader
				title="Mes groupes"
				description="Découvrez tous les groupes auxquels vous appartenez."
			/>
			<div className="flex flex-col gap-3">
				<SearchForm
					paramName="search"
					placeholder="Rechercher ..."
					className="w-full"
				/>
				<Button asChild size="lg" className="w-full sm:w-auto">
					<Link href="/app/my-groups/new">
						<Users className="mr-2 h-4 w-4" />
						Créer un groupe
					</Link>
				</Button>
			</div>
			<GroupList groups={groups} sessionId={session?.user.id} />
		</PageContainer>
	);
}
