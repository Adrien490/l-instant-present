import { getGroupInvite } from "@/app/entities/group-invites/queries/get-group-invite";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		inviteId: string;
	}>;
};

export default async function InvitePage({ params }: Props) {
	const resolvedParams = await params;
	const { inviteId } = resolvedParams;

	const invite = await getGroupInvite({ inviteId });

	if (!invite) {
		return notFound();
	}

	return (
		<PageContainer>
			<PageHeader title="Invitation" description="Voir l'invitation" />
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">{invite.group.name}</h1>
			</div>
		</PageContainer>
	);
}
