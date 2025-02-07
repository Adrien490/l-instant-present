import GroupForm from "@/app/features/groups/components/group-form";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";

export default function NewGroupPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Créer un groupe"
				description="Créez un groupe et invitez vos amis"
			/>
			<GroupForm />
		</PageContainer>
	);
}
