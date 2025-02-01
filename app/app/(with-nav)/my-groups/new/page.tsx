import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import GroupForm from "../components/group-form";

export default function NewGroupPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Créer un groupe"
				description="Créez un groupe pour partager vos réussites"
			/>
			<GroupForm />
		</PageContainer>
	);
}
