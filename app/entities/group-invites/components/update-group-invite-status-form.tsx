"use client";

import { Button } from "@/components/ui/button";
import { ServerActionStatus } from "@/types/server-action";
import { useUpdateGroupInviteStatus } from "../hooks/use-update-group-invite-status";
import { UpdateGroupInviteStatusParams } from "../schemas/update-group-invite-status-schema";

export function UpdateGroupInviteStatusForm({
	id,
	status,
}: UpdateGroupInviteStatusParams) {
	const { state, dispatch, isPending } = useUpdateGroupInviteStatus();

	return (
		<form action={dispatch}>
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="status" value={status} />
			<Button type="submit" disabled={isPending}>
				{state.status === ServerActionStatus.INITIAL
					? "Mettre à jour"
					: "En cours"}
			</Button>
		</form>
	);
}
