import ChallengePeriodForm from "@/app/features/challenge-periods/components/challenge-period-form";
import { getGroup } from "@/app/features/groups/queries/get-group";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ groupId: string }>;
};

export default async function NewChallengePeriodPage({ params }: Props) {
	const resolvedParams = await params;
	const { groupId } = resolvedParams;

	const group = await getGroup({ id: groupId });

	if (!group) {
		notFound();
	}

	return (
		<PageContainer>
			<PageHeader
				title="Nouvelle période de challenges"
				description="Créer une nouvelle période de challenges pour ce groupe"
				showBackButton
			/>
			<ChallengePeriodForm groupId={groupId} />
		</PageContainer>
	);
}
