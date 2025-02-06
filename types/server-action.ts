// types/server-action.ts
import { z } from "zod";

export enum ServerActionStatus {
	SUCCESS = "success",
	ERROR = "error",
	UNAUTHORIZED = "unauthorized",
	VALIDATION_ERROR = "validation_error",
	NOT_FOUND = "not_found",
	CONFLICT = "conflict",
	FORBIDDEN = "forbidden",
	PENDING = "pending",
	INITIAL = "initial",
}

export type ValidationErrors<T> = {
	[K in keyof T]?: string[];
};

// Nouveaux types discriminés pour typer l'état d'une action serveur
export interface SuccessState<TData> {
	status: ServerActionStatus.SUCCESS;
	message: string;
	data: TData;
}

export interface ValidationErrorState<
	TSchema extends z.ZodType,
	TData = undefined
> {
	status: ServerActionStatus.VALIDATION_ERROR;
	message: string;
	validationErrors: ValidationErrors<z.infer<TSchema>>;
	data?: TData;
}

export interface GenericErrorState<TData = undefined> {
	status: Exclude<
		ServerActionStatus,
		| ServerActionStatus.SUCCESS
		| ServerActionStatus.PENDING
		| ServerActionStatus.VALIDATION_ERROR
	>;
	message: string;
	data?: TData;
}

export type ServerActionState<TData, TSchema extends z.ZodType> =
	| SuccessState<TData>
	| ValidationErrorState<TSchema, TData>
	| GenericErrorState<TData>;

// Typage de la server action compatible avec useActionState
export type ServerAction<TData, TSchema extends z.ZodType> = (
	state: ServerActionState<TData, TSchema> | undefined,
	formData: FormData
) => Promise<ServerActionState<TData, TSchema>>;

// Fonction de création d'une réponse en cas de succès
export function createSuccessResponse<TData>(
	data: TData,
	message: string
): SuccessState<TData> {
	return {
		status: ServerActionStatus.SUCCESS,
		message,
		data,
	};
}

// Fonction de création d'une réponse en cas d'erreur de validation
export function createValidationErrorResponse<
	TSchema extends z.ZodType,
	TData = undefined
>(
	validationErrors: ValidationErrors<z.infer<TSchema>>,
	formData: z.infer<TSchema>,
	message: string
): ValidationErrorState<TSchema, TData> {
	return {
		status: ServerActionStatus.VALIDATION_ERROR,
		message,
		validationErrors,
		data: formData,
	};
}

// Fonction de création d'une réponse en cas d'erreur générique
export function createErrorResponse<TData>(
	status: Exclude<
		ServerActionStatus,
		| ServerActionStatus.SUCCESS
		| ServerActionStatus.PENDING
		| ServerActionStatus.VALIDATION_ERROR
	>,
	message: string
): GenericErrorState<TData> {
	return {
		status,
		message,
	};
}

// Guard type: vérifie si l'état est un succès
export function isSuccess<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema>
): state is SuccessState<TData> {
	return state.status === ServerActionStatus.SUCCESS;
}

// Guard type: vérifie si l'état est une erreur de validation
export function isValidationError<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema>
): state is ValidationErrorState<TSchema, TData> {
	return state.status === ServerActionStatus.VALIDATION_ERROR;
}
