"use client";

import { useGroupInviteForm } from "@/app/entities/group-invites/hooks/use-group-invite-form";
import groupInviteFormSchema from "@/app/entities/group-invites/schemas/group-invite-form-schema";
import PageBottom from "@/components/page-bottom";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface GroupInviteFormProps {
	groups: Array<{
		id: string;
		name: string;
	}>;
}

export default function GroupInviteForm({ groups }: GroupInviteFormProps) {
	const { dispatch, state, isPending } = useGroupInviteForm();

	const [form, fields] = useForm({
		id: "group-invite-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: groupInviteFormSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	useEffect(() => {
		if (state?.status === "success") {
			form.reset();
		}
	}, [state?.status, form]);

	return (
		<>
			<ServerActionResponse state={state} />
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="flex flex-col gap-6 pb-32"
			>
				<div className="space-y-4">
					<div className="space-y-1.5">
						<FormLabel htmlFor={fields.groupId.id}>
							Groupe <span className="text-destructive">*</span>
						</FormLabel>
						<Select
							name={fields.groupId.name}
							defaultValue={state?.data?.groupId}
							required
						>
							<SelectTrigger
								id={fields.groupId.id}
								className="w-full"
								aria-describedby={fields.groupId.descriptionId}
							>
								<SelectValue placeholder="Sélectionnez un groupe" />
							</SelectTrigger>
							<SelectContent>
								{groups.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{fields.groupId.errors && (
							<p
								className="text-sm text-destructive"
								id={fields.groupId.errorId}
							>
								{fields.groupId.errors[0]}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<FormLabel htmlFor={fields.email.id}>
							Email <span className="text-destructive">*</span>
						</FormLabel>
						<Input
							id={fields.email.id}
							name={fields.email.name}
							type="email"
							placeholder="Adresse email de la personne à inviter"
							aria-describedby={fields.email.descriptionId}
							aria-invalid={!fields.email.valid}
							defaultValue={state?.data?.email ?? ""}
						/>
						{fields.email.errors && (
							<p className="text-sm text-destructive" id={fields.email.errorId}>
								{fields.email.errors[0]}
							</p>
						)}
					</div>
				</div>

				<PageBottom>
					<div className="mx-auto max-w-2xl">
						<div>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending && (
									<Loader2
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Envoyer l&apos;invitation
							</Button>
						</div>
						<p className="text-xs text-muted-foreground text-center mt-4">
							Les champs marqués d&apos;un{" "}
							<span className="text-destructive">*</span> sont obligatoires
						</p>
					</div>
				</PageBottom>
			</form>
		</>
	);
}
