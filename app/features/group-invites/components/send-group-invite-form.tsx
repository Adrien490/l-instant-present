"use client";

import { useSendGroupInvite } from "@/app/features/group-invites/hooks/use-send-group-invite";
import groupInviteFormSchema from "@/app/features/group-invites/schemas/send-group-invite-schema";
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
import { GroupRole } from "@prisma/client";
import { Loader2, Users } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { GetGroupsResponse } from "../../groups/queries/get-groups";

interface SendGroupInviteFormProps {
	groups: GetGroupsResponse;
}

const ROLE_LABELS = {
	[GroupRole.MEMBER]: "Membre",
	[GroupRole.ADMIN]: "Administrateur",
};

export default function SendGroupInviteForm({
	groups,
}: SendGroupInviteFormProps) {
	const { dispatch, state, isPending } = useSendGroupInvite();

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
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Sélectionner un groupe" />
							</SelectTrigger>
							<SelectContent>
								{groups?.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										<div className="flex items-center gap-3 py-1">
											<div className="relative flex-shrink-0">
												{group.imageUrl ? (
													<div className="relative w-8 h-8">
														<Image
															src={group.imageUrl}
															alt={group.name}
															fill
															className="object-cover rounded-lg"
															sizes="32px"
														/>
													</div>
												) : (
													<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
														<Users className="h-4 w-4 text-primary" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">{group.name}</p>
											</div>
										</div>
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

					<div className="space-y-1.5">
						<FormLabel htmlFor={fields.role.id}>
							Rôle <span className="text-destructive">*</span>
						</FormLabel>
						<Select
							name={fields.role.name}
							defaultValue={state?.data?.role ?? GroupRole.MEMBER}
							required
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Sélectionner un rôle" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(ROLE_LABELS).map(([role, label]) => (
									<SelectItem key={role} value={role}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{fields.role.errors && (
							<p className="text-sm text-destructive" id={fields.role.errorId}>
								{fields.role.errors[0]}
							</p>
						)}
					</div>
				</div>

				<div className="">
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
			</form>
		</>
	);
}
