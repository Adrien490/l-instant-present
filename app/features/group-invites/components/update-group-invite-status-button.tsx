"use client";

import ServerActionResponse from "@/components/server-action-response";
import { Button, ButtonProps } from "@/components/ui/button";
import { GroupInviteStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useUpdateGroupInviteStatus } from "../hooks/use-update-group-invite-status";

type Props = {
	id: string;
	status: GroupInviteStatus;
	button: {
		variant: ButtonProps["variant"];
		children: React.ReactNode;
	};
};

export function UpdateGroupInviteStatusButton({ id, status, button }: Props) {
	const { state, dispatch, isPending } = useUpdateGroupInviteStatus();

	return (
		<>
			<ServerActionResponse state={state} />
			<form action={dispatch} className="w-full">
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="status" value={status} />
				<Button
					className="w-full"
					type="submit"
					disabled={isPending}
					{...button}
				>
					{isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
					{button.children}
				</Button>
			</form>
		</>
	);
}
