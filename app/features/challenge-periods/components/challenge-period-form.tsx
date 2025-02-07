"use client";

import { GetChallengePeriodResponse } from "@/app/features/challenge-periods/queries/get-challenge-period";
import challengePeriodFormSchema from "@/app/features/challenge-periods/schemas/challenge-period-schema";
import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChallengePeriod } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useActionState } from "react";
import createChallengePeriod from "../actions/create-challenge-period";

interface ChallengePeriodFormProps {
	period?: GetChallengePeriodResponse;
	groupId: string;
}

export default function ChallengePeriodForm({
	period,
	groupId,
}: ChallengePeriodFormProps) {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<ChallengePeriod, typeof challengePeriodFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				return await createChallengePeriod(previousState, formData);
			} catch (error) {
				console.error("[USE_GROUP_FORM]", error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
			data: period ?? undefined,
		}
	);

	const [form, fields] = useForm({
		id: "challenge-period-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: challengePeriodFormSchema });
		},
		defaultValue: {
			id: state?.data?.id ?? "",
			name: state?.data?.name ?? "",
			startDate: state?.data?.startDate
				? new Date(state.data.startDate).toISOString()
				: undefined,
			endDate: state?.data?.endDate
				? new Date(state.data.endDate).toISOString()
				: undefined,
			groupId: groupId,
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const startDateControl = useInputControl(fields.startDate);
	const endDateControl = useInputControl(fields.endDate);

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
				<input type="hidden" name="groupId" value={groupId} />

				<div className="space-y-6">
					<div className="space-y-4">
						{/* Nom */}
						<div className="space-y-2">
							<FormLabel htmlFor={fields.name.id} className="text-base">
								Nom <span className="text-destructive">*</span>
							</FormLabel>
							<Input
								id={fields.name.id}
								name={fields.name.name}
								placeholder="Nom de la période"
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

						{/* Date de début */}
						<div className="space-y-2">
							<FormLabel htmlFor={fields.startDate.id} className="text-base">
								Date de début <span className="text-destructive">*</span>
							</FormLabel>
							<input
								type="hidden"
								name={fields.startDate.name}
								value={fields.startDate.value ?? ""}
							/>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full h-11 justify-start text-left font-normal",
											!fields.startDate.value && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-3 h-5 w-5" />
										{fields.startDate.value ? (
											format(new Date(fields.startDate.value), "PPP", {
												locale: fr,
											})
										) : (
											<span>Sélectionner une date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={
											fields.startDate.value
												? new Date(fields.startDate.value)
												: undefined
										}
										onSelect={(date) => {
											startDateControl.change(date?.toISOString() ?? "");
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							{fields.startDate.errors && (
								<p
									className="text-sm text-destructive"
									id={fields.startDate.errorId}
								>
									{fields.startDate.errors[0]}
								</p>
							)}
						</div>

						{/* Date de fin */}
						<div className="space-y-2">
							<FormLabel htmlFor={fields.endDate.id} className="text-base">
								Date de fin <span className="text-destructive">*</span>
							</FormLabel>
							<input
								type="hidden"
								name={fields.endDate.name}
								value={fields.endDate.value ?? ""}
							/>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full h-11 justify-start text-left font-normal",
											!fields.endDate.value && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-3 h-5 w-5" />
										{fields.endDate.value ? (
											format(new Date(fields.endDate.value), "PPP", {
												locale: fr,
											})
										) : (
											<span>Sélectionner une date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={
											fields.endDate.value
												? new Date(fields.endDate.value)
												: undefined
										}
										onSelect={(date) => {
											endDateControl.change(date?.toISOString() ?? "");
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							{fields.endDate.errors && (
								<p
									className="text-sm text-destructive"
									id={fields.endDate.errorId}
								>
									{fields.endDate.errors[0]}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-3 pt-2">
						<Button
							type="submit"
							className="w-full h-11 text-base"
							disabled={isPending}
						>
							{isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
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
