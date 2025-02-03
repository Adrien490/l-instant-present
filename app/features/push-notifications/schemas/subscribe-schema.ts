import { z } from "zod";

const subscribeSchema = z.object({
	subscription: z.object({
		endpoint: z.string(),
		keys: z.object({
			p256dh: z.string(),
			auth: z.string(),
		}),
	}),
});

export type SubscribeParams = z.infer<typeof subscribeSchema>;

export default subscribeSchema;
