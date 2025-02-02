import GroupItem from "@/app/entities/groups/components/group-item";
import getGroups from "@/app/entities/groups/queries/get-groups";
import EmptyState from "@/components/empty-state";
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

	return (
		<PageContainer className="pb-32">
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
			<div className="mt-4 flex flex-col gap-2.5">
				{groups.length === 0 && (
					<EmptyState
						title="Aucun groupe trouvé"
						description="Vous n'appartenez à aucun groupe"
						icon={<Users className="h-8 w-8 text-muted-foreground/80" />}
					/>
				)}
				{groups.map((group) => (
					<GroupItem
						key={group.id}
						group={group}
						isOwner={group.ownerId === session?.user.id}
					/>
				))}
			</div>
		</PageContainer>
	);
}
