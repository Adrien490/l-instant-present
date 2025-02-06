"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { use } from "react";
import { GetGroupListResponse } from "../queries/get-group-list";
import GroupCard from "./group-card";

type Props = {
	getGroupListPromise: Promise<GetGroupListResponse>;
	sessionId: string;
	className?: string;
};

export default function GroupList({
	getGroupListPromise,
	sessionId,
	className,
}: Props) {
	const groups = use(getGroupListPromise);

	if (groups.length === 0) {
		return (
			<EmptyPlaceholder
				title="Aucun groupe trouvé"
				description="Vous n'appartenez à aucun groupe"
				icon={<Users className="h-5 w-5 text-muted-foreground/80" />}
			/>
		);
	}

	return (
		<div className={cn("", className)}>
			{groups.map((group) => {
				const isOwner = group.members.some(
					(member: { user: { id: string } }) => member.user.id === sessionId
				);

				return <GroupCard key={group.id} group={group} isOwner={isOwner} />;
			})}
		</div>
	);
}
