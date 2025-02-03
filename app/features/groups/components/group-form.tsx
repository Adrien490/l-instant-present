"use client";

import { GetGroupResponse } from "@/app/features/groups/queries/get-group";
import groupFormSchema from "@/app/features/groups/schemas/group-form-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useGroupForm } from "../hooks/use-group-form";

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

	const imageUrl = fields.imageUrl.value || state?.data?.imageUrl;

	return (
		<>
			<ServerActionResponse state={state} />

			<form
				onSubmit={form.onSubmit}
				id={form.id}
				action={dispatch}
				className="flex flex-col gap-6"
			>
				<input type="hidden" name="id" value={state?.data?.id ?? ""} />
				<input
					type="hidden"
					id={fields.imageUrl.id}
					name={fields.imageUrl.name}
				/>

				<div className="space-y-8">
					{/* Section upload d'image */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<FormLabel className="text-base font-medium">
									Image du groupe
								</FormLabel>
								<p className="text-sm text-muted-foreground">
									Format recommandé : 1200×600px ou plus grand
								</p>
							</div>
							{imageUrl && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive/90"
									onClick={() => {
										const input = document.getElementById(
											fields.imageUrl.id
										) as HTMLInputElement;
										if (input) {
											input.value = "";
											input.dispatchEvent(
												new Event("change", { bubbles: true })
											);
										}
									}}
								>
									Changer l&apos;image
								</Button>
							)}
						</div>

						<div className="relative rounded-lg overflow-hidden">
							{imageUrl ? (
								<div className="relative aspect-video bg-muted">
									<Image
										src={imageUrl}
										alt="Image du groupe"
										fill
										className="object-cover"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										priority
									/>
									<div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
								</div>
							) : (
								<UploadDropzone
									endpoint="groupImage"
									config={{ mode: "auto" }}
									onClientUploadComplete={(res) => {
										const input = document.getElementById(
											fields.imageUrl.id
										) as HTMLInputElement;
										if (input) {
											input.value = res[0].url;
											input.dispatchEvent(
												new Event("change", { bubbles: true })
											);
										}
									}}
									onUploadError={(error) => {
										console.error("[GROUP_FORM] Upload error:", error);
									}}
									appearance={{
										container: "aspect-video bg-muted/50",
										label: "text-base font-medium",
										allowedContent: "text-sm text-muted-foreground mt-1",
										button: "hidden",
									}}
									className="rounded-lg border-2 border-dashed border-muted-foreground/25"
								/>
							)}
						</div>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
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
								<p
									className="text-sm text-destructive"
									id={fields.name.errorId}
								>
									{fields.name.errors[0]}
								</p>
							)}
						</div>

						<div className="space-y-2">
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

					<div className="space-y-4">
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Enregistrer
						</Button>
						<p className="text-xs text-muted-foreground text-center">
							Les champs marqués d&apos;un{" "}
							<span className="text-destructive">*</span> sont obligatoires
						</p>
					</div>
				</div>
			</form>
		</>
	);
}
