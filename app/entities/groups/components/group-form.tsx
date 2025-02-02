"use client";

import { GetGroupResponse } from "@/app/entities/groups/queries/get-group";
import groupFormSchema from "@/app/entities/groups/schemas/group-form-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useGroupForm } from "../hooks/use-group-form";

interface GroupFormProps {
	group?: GetGroupResponse;
}

export default function GroupForm({ group }: GroupFormProps) {
	const { dispatch, state, isPending } = useGroupForm({ group });
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [form, fields] = useForm({
		id: "group-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: groupFormSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const currentImageUrl =
		previewUrl || state?.data?.imageUrl || group?.imageUrl;

	const handleRemoveImage = () => {
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		const imageUrlInput = document.getElementById(
			fields.imageUrl?.id
		) as HTMLInputElement;
		if (imageUrlInput) {
			imageUrlInput.value = "";
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<ServerActionResponse state={state} />
			<form id={form.id} action={dispatch}>
				<input type="hidden" name="id" value={state?.data?.id ?? ""} />

				<div className="space-y-8">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<FormLabel className="text-base">Image du groupe</FormLabel>
							{currentImageUrl && (
								<button
									type="button"
									onClick={handleRemoveImage}
									className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
								>
									<X className="h-3.5 w-3.5" />
									<span>Supprimer l&apos;image</span>
								</button>
							)}
						</div>

						<div className="w-full">
							<div className="relative">
								{currentImageUrl ? (
									<div className="relative min-h-[280px] rounded-2xl overflow-hidden">
										<Image
											src={currentImageUrl}
											alt="Image actuelle du groupe"
											fill
											className="object-cover"
											sizes="(max-width: 640px) 100vw, 50vw"
											priority
										/>
										<div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
										<Button
											type="button"
											variant="secondary"
											className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm"
											onClick={() => fileInputRef.current?.click()}
										>
											Changer l&apos;image
										</Button>
									</div>
								) : (
									<div className="flex flex-col items-center gap-4 min-h-[280px] border border-dashed border-muted-foreground/25 bg-muted/50 rounded-2xl p-8">
										<p className="text-center">
											Ajoutez une image pour votre groupe
										</p>
										<Button
											type="button"
											variant="secondary"
											onClick={() => fileInputRef.current?.click()}
										>
											Choisir une image
										</Button>
										<p className="text-xs text-muted-foreground text-center">
											JPG, PNG, GIF • Max : 4MB
										</p>
									</div>
								)}
								<input
									ref={fileInputRef}
									type="file"
									name="imageUrl"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
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
