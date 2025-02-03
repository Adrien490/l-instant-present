import { redis } from "../../../../lib/redis";
import { CONFIG } from "../config/config";

export class RateLimiter {
	private readonly prefix = "push_notification_rate_limit:";

	async increment(key: string): Promise<boolean> {
		const redisKey = this.prefix + key;
		const multi = redis.multi();

		multi.incr(redisKey);
		multi.pexpire(redisKey, CONFIG.RATE_LIMIT.WINDOW);

		const results = await multi.exec();
		const count = results?.[0]?.[1] as number;

		return count <= CONFIG.RATE_LIMIT.MAX_REQUESTS;
	}

	async reset(key: string): Promise<void> {
		await redis.del(this.prefix + key);
	}
}

// Rate limiting simple en mémoire
const rateLimitStore = {
	requests: 0,
	windowStart: Date.now(),
};

export function checkRateLimit() {
	const now = Date.now();
	if (now - rateLimitStore.windowStart > CONFIG.RATE_LIMIT.WINDOW) {
		rateLimitStore.requests = 0;
		rateLimitStore.windowStart = now;
	}

	if (rateLimitStore.requests >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
		throw new Error("Rate limit exceeded");
	}

	rateLimitStore.requests++;
}
