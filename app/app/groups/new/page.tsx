import GroupForm from "@/app/features/groups/components/group-form";
import UserAvatar from "@/app/features/users/components/user-avatar";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";

export default function NewGroupPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Créer un groupe"
				description="Créez un groupe et invitez vos amis"
				showBackButton
				actions={<UserAvatar />}
				className="mb-4"
			/>
			<GroupForm />
		</PageContainer>
	);
}
