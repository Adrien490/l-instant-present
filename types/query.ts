export enum QueryStatus {
	SUCCESS = "success",
	ERROR = "error",
}
export interface QuerySuccess<T, Meta = undefined> {
	status: QueryStatus.SUCCESS;
	data: T;
	meta?: Meta;
}
export interface QueryError {
	status: QueryStatus.ERROR;
	message: string;
}
export type QueryResponse<T, Meta = undefined> =
	| QuerySuccess<T, Meta>
	| QueryError;
