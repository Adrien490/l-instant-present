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
	IDLE = "idle",
}

export type ValidationErrors<T> = {
	[K in keyof T]?: string[];
};

export type ServerResponse<TData> = {
	status: ServerActionStatus;
	message: string;
	data?: TData;
};

export type ServerActionState<
	TData,
	TSchema extends z.ZodType
> = ServerResponse<TData> & {
	validationErrors?: ValidationErrors<z.infer<TSchema>>;
	formData?: z.infer<TSchema>;
};

export type ServerAction<TData, TSchema extends z.ZodType> = (
	state: ServerActionState<TData, TSchema> | undefined,
	formData: FormData
) => Promise<ServerActionState<TData, TSchema>>;

export function createSuccessResponse<TData, TSchema extends z.ZodType>(
	data: TData,
	message: string
): ServerActionState<TData, TSchema> {
	return {
		status: ServerActionStatus.SUCCESS,
		message,
		data,
	};
}

export function createErrorResponse<TData, TSchema extends z.ZodType>(
	status: ServerActionStatus,
	message: string
): ServerActionState<TData, TSchema> {
	return {
		status,
		message,
	};
}

export function createValidationErrorResponse<TData, TSchema extends z.ZodType>(
	validationErrors: ValidationErrors<z.infer<TSchema>>,
	formData: z.infer<TSchema>,
	message: string
): ServerActionState<TData, TSchema> {
	return {
		status: ServerActionStatus.VALIDATION_ERROR,
		message,
		validationErrors,
		formData,
	};
}

export function isPending<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema> | undefined
): boolean {
	return state?.status === ServerActionStatus.PENDING;
}

export function isSuccess<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema> | undefined
): boolean {
	return state?.status === ServerActionStatus.SUCCESS;
}

export function isError<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema> | undefined
): boolean {
	return (
		state?.status === ServerActionStatus.ERROR ||
		state?.status === ServerActionStatus.VALIDATION_ERROR ||
		state?.status === ServerActionStatus.UNAUTHORIZED ||
		state?.status === ServerActionStatus.FORBIDDEN ||
		state?.status === ServerActionStatus.NOT_FOUND ||
		state?.status === ServerActionStatus.CONFLICT
	);
}

export function hasValidationErrors<TData, TSchema extends z.ZodType>(
	state: ServerActionState<TData, TSchema> | undefined
): boolean {
	return state?.status === ServerActionStatus.VALIDATION_ERROR;
}
