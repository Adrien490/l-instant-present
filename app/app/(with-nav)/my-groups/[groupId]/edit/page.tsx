import GroupForm from "@/app/entities/groups/components/group-form";
import { getGroup } from "@/app/entities/groups/queries/get-group";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		groupId: string;
	}>;
};

export default async function EditGroupPage({ params }: Props) {
	const resolvedParams = await params;
	const group = await getGroup({ id: resolvedParams.groupId });

	if (!group) {
		return notFound();
	}

	return (
		<PageContainer className="pb-32">
			<PageHeader
				title={`Modifier le groupe "${group.name}"`}
				description={
					"Vous pouvez modifier le nom, la description et l'image du groupe"
				}
			/>
			<GroupForm group={group} />
		</PageContainer>
	);
}
