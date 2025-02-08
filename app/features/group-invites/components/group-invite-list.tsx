// group-invite-list.tsx
"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { use } from "react";
import { GetGroupInviteListResponse } from "../queries/get-group-invite-list";
import GroupInviteCard from "./group-invite-card";

type Props = {
	getGroupInviteListPromise: Promise<GetGroupInviteListResponse>;
	filter: "received" | "sent";
	className?: string;
};

export default function GroupInviteList({
	getGroupInviteListPromise,
	filter,
	className,
}: Props) {
	const invites = use(getGroupInviteListPromise);

	if (invites.length === 0) {
		return (
			<EmptyPlaceholder
				title="Aucune invitation trouvée"
				description={
					filter === "sent"
						? "Vous n'avez envoyé aucune invitation"
						: "Vous n'avez reçu aucune invitation"
				}
				icon={<Mail className="h-5 w-5 text-muted-foreground/80" />}
			/>
		);
	}

	return (
		<div className={cn("", className)}>
			{invites.map((invite) => (
				<GroupInviteCard
					key={invite.id}
					invite={invite}
					isSent={filter === "sent"}
				/>
			))}
		</div>
	);
}
