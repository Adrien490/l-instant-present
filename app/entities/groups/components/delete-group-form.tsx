"use client";

import { GetGroupResponse } from "@/app/entities/groups/queries/get-group";
import deleteGroupSchema from "@/app/entities/groups/schemas/delete-group-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { AlertTriangle, Loader2, Users } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
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

	useEffect(() => {
		if (state?.status === "success") {
			window.location.href =
				"/app/my-groups/" + group.id + "/delete?deleted=true";
		}
	}, [state?.status, group.id]);

	return (
		<>
			<ServerActionResponse state={state} />
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="max-w-2xl mx-auto space-y-8"
			>
				<input type="hidden" name="id" value={group.id} />

				<div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
					{group.imageUrl ? (
						<Image
							src={group.imageUrl}
							alt={group.name}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							priority
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-destructive/20 to-destructive/10">
							<Users className="h-12 w-12 text-destructive" />
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
					<div className="absolute bottom-0 left-0 right-0 p-6">
						<h1 className="text-2xl font-semibold text-white">{group.name}</h1>
						{group.description && (
							<p className="mt-2 text-base text-white/90 line-clamp-2">
								{group.description}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-start gap-4 p-4 text-destructive bg-destructive/10 rounded-lg">
					<AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
					<div className="space-y-2">
						<p className="font-medium">Action irréversible</p>
						<div className="space-y-1 text-sm text-destructive/90">
							<p>
								La suppression d&apos;un groupe est définitive et entraînera :
							</p>
							<ul className="list-disc pl-4 space-y-1">
								<li>La suppression de toutes les données du groupe</li>
								<li>La révocation de tous les membres</li>
								<li>La suppression des invitations en cours</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<FormLabel htmlFor={fields.confirmName.id} className="text-base">
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
						className="bg-destructive/5 border-destructive/20 placeholder:text-destructive/50"
					/>
					{fields.confirmName.errors && (
						<p
							className="text-sm text-destructive"
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
						className="w-full font-medium"
						disabled={isPending}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Supprimer définitivement
					</Button>
					<p className="text-xs text-center text-muted-foreground">
						Cette action est irréversible et ne peut pas être annulée
					</p>
				</div>
			</form>
		</>
	);
}
