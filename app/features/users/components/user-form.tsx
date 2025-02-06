"use client";

import { GetUserResponse } from "@/app/features/users/queries/get-user";
import userFormSchema from "@/app/features/users/schemas/user-form-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Loader2, User } from "lucide-react";
import useUserForm from "../hooks/use-user-form";

interface UserFormProps {
	user?: GetUserResponse;
}

export default function UserForm({ user }: UserFormProps) {
	const { dispatch, state, isPending } = useUserForm({
		user: user ?? undefined,
	});
	const { isUploading, startUpload } = useUploadThing("userAvatar");

	const [form, fields] = useForm({
		id: "user-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: userFormSchema });
		},
		defaultValue: {
			name: state?.data?.name ?? "",
			image: state?.data?.image ?? "",
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const imageControl = useInputControl(fields.image);
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
				<input type="hidden" name="id" value={state?.data?.id ?? ""} />
				<input type="hidden" id={fields.image.id} name={fields.image.name} />

				<div className="space-y-6">
					{/* Section upload d'avatar */}
					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div className="space-y-1">
								<FormLabel className="text-base font-medium">
									Photo de profil
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
									Changer la photo
								</Button>
							)}
						</div>

						<div className="relative rounded-lg overflow-hidden shadow-sm">
							{imageUrl ? (
								<div className="relative w-40 mx-auto">
									<Avatar className="w-40 h-40 border-4 border-background shadow-lg">
										<AvatarImage src={imageUrl} alt="Photo de profil" />
										<AvatarFallback className="bg-muted">
											<User className="w-16 h-16 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>
								</div>
							) : (
								<div className="relative touch-none w-40 mx-auto">
									<div className="rounded-full overflow-hidden border-4 border-background shadow-lg">
										<UploadDropzone
											endpoint="userAvatar"
											onChange={async (files) => {
												const res = await startUpload(files);
												if (res?.[0]?.serverData?.url) {
													imageControl.change(res[0].serverData.url);
												}
											}}
											onUploadError={(error) => {
												console.error("[USER_FORM] Upload error:", error);
											}}
											appearance={{
												container:
													"w-40 h-40 bg-muted flex items-center justify-center",
												label: "text-base font-medium",
												allowedContent: "text-sm text-muted-foreground mt-1",
												button: "hidden",
											}}
											className="hover:bg-muted/80 transition-colors"
										/>
									</div>
									{isUploading && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full">
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
								placeholder="Votre nom"
								aria-describedby={fields.name.descriptionId}
								aria-invalid={!fields.name.valid}
								defaultValue={state?.data?.name ?? ""}
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
