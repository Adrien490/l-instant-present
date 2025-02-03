"use client";

import { GetGroupResponse } from "@/app/features/groups/queries/get-group";
import deleteGroupSchema from "@/app/features/groups/schemas/delete-group-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteGroup } from "../hooks/use-delete-group";

interface DeleteGroupFormProps {
	group: GetGroupResponse;
}

export default function DeleteGroupForm({ group }: DeleteGroupFormProps) {
	const { dispatch, state, isPending } = useDeleteGroup();

	const [form, fields] = useForm({
		id: "delete-group-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: deleteGroupSchema });
		},
		shouldValidate: "onInput",
	});

	const isNameMatch = fields.confirmName.value === group.name;

	return (
		<>
			<ServerActionResponse state={state} />
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="space-y-8"
			>
				<input type="hidden" name="id" value={group.id} />

				<div className="flex items-start gap-4 p-4 text-destructive bg-destructive/10 rounded-lg">
					<AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 transform-gpu" />
					<div className="space-y-2">
						<p className="font-medium text-base leading-normal antialiased">
							Action irréversible
						</p>
						<div className="space-y-1">
							<p className="text-sm leading-normal antialiased text-destructive/90">
								La suppression d&apos;un groupe est définitive et entraînera :
							</p>
							<ul className="list-disc pl-4 space-y-1">
								<li className="text-sm leading-normal antialiased text-destructive/90">
									La suppression de toutes les données du groupe
								</li>
								<li className="text-sm leading-normal antialiased text-destructive/90">
									La révocation de tous les membres
								</li>
								<li className="text-sm leading-normal antialiased text-destructive/90">
									La suppression des invitations en cours
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<FormLabel
						htmlFor={fields.confirmName.id}
						className="text-base leading-normal antialiased"
					>
						Pour confirmer la suppression, écrivez{" "}
						<span className="font-medium text-destructive">{group.name}</span>
					</FormLabel>
					<Input
						id={fields.confirmName.id}
						name={fields.confirmName.name}
						placeholder={`Écrivez "${group.name}" pour confirmer`}
						aria-describedby={fields.confirmName.descriptionId}
						aria-invalid={!fields.confirmName.valid}
						autoComplete="off"
						autoCorrect="off"
						className="bg-destructive/5 border-destructive/20 placeholder:text-destructive/50 text-base leading-normal antialiased"
					/>
					{fields.confirmName.errors && (
						<p
							className="text-sm leading-normal antialiased text-destructive"
							id={fields.confirmName.errorId}
						>
							{fields.confirmName.errors[0]}
						</p>
					)}
				</div>

				<div className="space-y-4">
					<Button
						type="submit"
						variant="destructive"
						size="lg"
						className="w-full touch-target-2025 min-h-[44px] font-medium text-base leading-normal antialiased"
						disabled={isPending || !isNameMatch}
					>
						{isPending && (
							<Loader2 className="mr-3 h-5 w-5 animate-spin transform-gpu" />
						)}
						Supprimer définitivement
					</Button>
					<p className="text-xs leading-normal antialiased text-center text-muted-foreground">
						Cette action est irréversible et ne peut pas être annulée
					</p>
				</div>
			</form>
		</>
	);
}
