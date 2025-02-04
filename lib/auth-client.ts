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

// Configuration par défaut pour la connexion
const originalSignIn = authClient.signIn.email;
authClient.signIn.email = async (params) => {
	return originalSignIn({
		...params,
		rememberMe: true, // Forcer la persistance
	});
};

export const { useSession } = authClient;
