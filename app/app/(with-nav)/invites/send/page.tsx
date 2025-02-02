import getGroups from "@/app/entities/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import GroupInviteForm from "../../../../entities/group-invites/components/group-invite-form";

export default async function SendInvitePage() {
	const groups = await getGroups({ search: "" });

	return (
		<PageContainer>
			<PageHeader
				title="Envoyer une invitation"
				description="Envoyez une invitation à un utilisateur pour rejoindre un groupe."
			/>

			<GroupInviteForm groups={groups} />
		</PageContainer>
	);
}
