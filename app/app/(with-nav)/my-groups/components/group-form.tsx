"use client";

import { useGroupForm } from "@/app/entities/groups/hooks/use-group-form";
import { GetGroupResponse } from "@/app/entities/groups/queries/get-group";
import groupFormSchema from "@/app/entities/groups/schemas/group-form-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";

interface GroupFormProps {
	group?: GetGroupResponse;
}

export default function GroupForm({ group }: GroupFormProps) {
	const { dispatch, state, isPending } = useGroupForm({ group });

	const [form, fields] = useForm({
		id: "group-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: groupFormSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<>
			<ServerActionResponse state={state} />
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="flex flex-col gap-6 pb-32"
			>
				<input type="hidden" name="id" value={state?.data?.id ?? ""} />

				<div className="space-y-4">
					<div className="space-y-1.5">
						<FormLabel htmlFor={fields.name.id}>
							Nom <span className="text-destructive">*</span>
						</FormLabel>
						<Input
							id={fields.name.id}
							name={fields.name.name}
							placeholder="Nom du groupe"
							aria-describedby={fields.name.descriptionId}
							aria-invalid={!fields.name.valid}
							defaultValue={group ? state?.data?.name : ""}
						/>
						{fields.name.errors && (
							<p className="text-sm text-destructive" id={fields.name.errorId}>
								{fields.name.errors[0]}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<FormLabel htmlFor={fields.description.id}>Description</FormLabel>
						<Textarea
							id={fields.description.id}
							name={fields.description.name}
							placeholder="Description du groupe"
							aria-describedby={fields.description.descriptionId}
							aria-invalid={!fields.description.valid}
							defaultValue={group ? state?.data?.description ?? "" : ""}
							rows={4}
						/>
						{fields.description.errors && (
							<p
								className="text-sm text-destructive"
								id={fields.description.errorId}
							>
								{fields.description.errors[0]}
							</p>
						)}
					</div>
				</div>

				<div className="fixed inset-x-0 bottom-16 bg-background border-t p-4">
					<div className="mx-auto max-w-2xl">
						<div>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending && (
									<Loader2
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								{group ? "Enregistrer" : "Créer"}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground text-center mt-4">
							Les champs marqués d&apos;un{" "}
							<span className="text-destructive">*</span> sont obligatoires
						</p>
					</div>
				</div>
			</form>
		</>
	);
}
