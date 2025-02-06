import GroupForm from "@/app/features/groups/components/group-form";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";

export default function NewGroupPage() {
	return (
		<PageContainer className="pb-32">
			<PageHeader
				title="Créer un groupe"
				description="Créez un groupe pour partager vos réussites"
			/>
			<GroupForm />
		</PageContainer>
	);
}
