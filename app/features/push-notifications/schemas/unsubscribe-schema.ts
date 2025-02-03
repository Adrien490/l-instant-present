import { z } from "zod";

const unsubscribeSchema = z.object({
	endpoint: z.string(),
});

export type UnsubscribeParams = z.infer<typeof unsubscribeSchema>;

export default unsubscribeSchema;
