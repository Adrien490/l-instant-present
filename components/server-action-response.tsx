"use client";

import { useToast } from "@/hooks/use-toast";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useEffect } from "react";
import { z } from "zod";

interface ServerActionResponseProps<TData, TSchema extends z.ZodType> {
	state: ServerActionState<TData, TSchema> | null;
}

export default function ServerActionResponse<TData, TSchema extends z.ZodType>({
	state,
}: ServerActionResponseProps<TData, TSchema>) {
	const { toast } = useToast();

	useEffect(() => {
		if (!state) return;

		const toastConfig = {
			duration: 3000,
			className: "max-w-[90vw]",
		};

		switch (state.status) {
			case ServerActionStatus.SUCCESS:
				toast({
					...toastConfig,
					title: "✓ Succès",
					description: state.message,
					className: "bg-green-50 border-green-200 text-green-900",
				});
				break;

			case ServerActionStatus.VALIDATION_ERROR:
				const errors = state.validationErrors
					? Object.entries(state.validationErrors)
							.map(([field, fieldErrors]) => {
								const fieldName =
									field.charAt(0).toUpperCase() + field.slice(1);
								return `${fieldName}: ${fieldErrors?.join(", ")}`;
							})
							.join("\n")
					: state.message;

				toast({
					...toastConfig,
					title: "⚠️ Validation",
					description: errors,
					className: "bg-yellow-50 border-yellow-200 text-yellow-900",
				});
				break;

			case ServerActionStatus.ERROR:
			case ServerActionStatus.UNAUTHORIZED:
			case ServerActionStatus.FORBIDDEN:
			case ServerActionStatus.NOT_FOUND:
			case ServerActionStatus.CONFLICT:
				toast({
					...toastConfig,
					title: "✕ Erreur",
					description: state.message,
					className: "bg-red-50 border-red-200 text-red-900",
				});
				break;
		}
	}, [state, toast]);

	return null;
}
