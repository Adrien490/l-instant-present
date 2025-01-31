import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./db";

if (!process.env.BETTER_AUTH_SECRET) {
	throw new Error("BETTER_AUTH_SECRET is not defined");
}

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	baseUrl: process.env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		},
	},
	plugins: [nextCookies()],
	pages: {
		error: "/auth/error",
		signIn: "/login",
	},
});
