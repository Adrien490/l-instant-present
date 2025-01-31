import { createAuthClient } from "better-auth/react";

export type Provider =
	| "github"
	| "google"
	| "apple"
	| "discord"
	| "facebook"
	| "microsoft"
	| "spotify"
	| "twitch"
	| "twitter"
	| "dropbox"
	| "linkedin"
	| "gitlab"
	| "reddit";

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
});

export const { useSession } = authClient;
