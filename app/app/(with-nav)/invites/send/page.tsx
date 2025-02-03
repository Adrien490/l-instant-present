import SendGroupInviteForm from "@/app/features/group-invites/components/send-group-invite-form";
import getGroups from "@/app/features/groups/queries/get-groups";
import EmptyState from "@/components/empty-state";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Users } from "lucide-react";

export default async function SendInvitePage() {
	const groups = await getGroups({ search: "" });

	return (
		<PageContainer>
			<PageHeader
				title="Envoyer une invitation"
				description="Envoyez une invitation à un utilisateur pour rejoindre un groupe."
			/>
			{groups.length > 0 ? (
				<SendGroupInviteForm groups={groups} />
			) : (
				<EmptyState
					title="Aucun groupe trouvé"
					description="Vous n'avez pas encore créé de groupe."
					icon={<Users className="h-4 w-4" />}
				/>
			)}
		</PageContainer>
	);
}
