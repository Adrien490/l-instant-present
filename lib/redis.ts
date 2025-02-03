import { Redis, RedisOptions } from "ioredis";

const getRedisConfig = (): RedisOptions => {
	if (!process.env.REDIS_PASSWORD) {
		throw new Error("REDIS_PASSWORD est requis");
	}

	return {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT ?? "0"),
		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PASSWORD,
	};
};

const globalForRedis = globalThis as unknown as {
	redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? new Redis(getRedisConfig());

if (process.env.NODE_ENV !== "production") {
	globalForRedis.redis = redis;
}

redis.on("error", (error) => {
	console.error("[REDIS] Erreur de connexion:", error);
});

redis.on("connect", () => {
	console.info("[REDIS] Connecté avec succès");
});
