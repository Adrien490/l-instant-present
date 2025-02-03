import GroupItem from "@/app/entities/groups/components/group-item";
import { getGroup } from "@/app/entities/groups/queries/get-group";
import PageContainer from "@/components/page-container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function GroupPage({
	params,
}: {
	params: { groupId: string };
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	const group = await getGroup({ id: params.groupId });

	if (!group) {
		return notFound();
	}

	return (
		<PageContainer className="pb-32">
			<GroupItem group={group} isOwner={group.ownerId === session?.user.id} />
		</PageContainer>
	);
}
