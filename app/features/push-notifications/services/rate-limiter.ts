import { CONFIG } from "../config";
import { redis } from "../../../../lib/redis";

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
