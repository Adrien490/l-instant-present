"use client";

import { GetGroupResponse } from "@/app/features/groups/queries/get-group";
import groupFormSchema from "@/app/features/groups/schemas/group-form-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useGroupForm } from "../hooks/use-group-form";

interface GroupFormProps {
	group?: GetGroupResponse;
}

export default function GroupForm({ group }: GroupFormProps) {
	const { dispatch, state, isPending } = useGroupForm({ group });
	const { isUploading, startUpload } = useUploadThing("groupImage");

	const [form, fields] = useForm({
		id: "group-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: groupFormSchema });
		},
		defaultValue: {
			id: state?.data?.id ?? "",
			name: state?.data?.name ?? "",
			description: state?.data?.description ?? "",
			imageUrl: state?.data?.imageUrl ?? "",
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const imageControl = useInputControl(fields.imageUrl);
	const imageUrl = imageControl.value;

	return (
		<>
			<ServerActionResponse state={state} />

			<form
				onSubmit={form.onSubmit}
				id={form.id}
				action={dispatch}
				className="flex flex-col gap-4 w-full"
			>
				<input type="hidden" name="id" value={fields.id.value ?? ""} />
				<input
					type="hidden"
					id={fields.imageUrl.id}
					name={fields.imageUrl.name}
				/>

				<div className="space-y-6">
					{/* Section upload d'image */}
					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div className="space-y-1">
								<FormLabel className="text-base font-medium">
									Image du groupe
								</FormLabel>
							</div>
							{imageUrl && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive/90 w-full sm:w-auto"
									onClick={() => imageControl.change("")}
								>
									Changer l&apos;image
								</Button>
							)}
						</div>

						<div className="relative rounded-lg overflow-hidden shadow-sm">
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
								<div className="relative touch-none">
									<UploadDropzone
										endpoint="groupImage"
										onChange={async (files) => {
											const res = await startUpload(files);
											if (res?.[0]?.serverData?.url) {
												imageControl.change(res[0].serverData.url);
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
										className="rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/40 transition-colors"
									/>
									{isUploading && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
											<div className="flex flex-col items-center gap-2">
												<Loader2 className="h-8 w-8 animate-spin text-white" />
												<p className="text-sm text-white font-medium">
													Upload en cours...
												</p>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<FormLabel htmlFor={fields.name.id} className="text-base">
								Nom <span className="text-destructive">*</span>
							</FormLabel>
							<Input
								id={fields.name.id}
								name={fields.name.name}
								placeholder="Nom du groupe"
								aria-describedby={fields.name.descriptionId}
								aria-invalid={!fields.name.valid}
								defaultValue={fields.name.value ?? ""}
								className="h-11"
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
							<FormLabel htmlFor={fields.description.id} className="text-base">
								Description
							</FormLabel>
							<Textarea
								id={fields.description.id}
								name={fields.description.name}
								placeholder="Description du groupe"
								aria-describedby={fields.description.descriptionId}
								aria-invalid={!fields.description.valid}
								defaultValue={fields.description.value ?? ""}
								rows={4}
								className="resize-none"
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

					<div className="space-y-3 pt-2">
						<Button
							type="submit"
							className="w-full h-11 text-base"
							disabled={isPending || isUploading}
						>
							{(isPending || isUploading) && (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							)}
							{isUploading ? "Upload en cours..." : "Enregistrer"}
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
