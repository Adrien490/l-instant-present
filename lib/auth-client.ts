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
	storage: {
		type: "localStorage",
		key: "auth_session",
	},
	session: {
		refreshOnFocus: true,
		refreshInterval: 5 * 60, // Rafraîchir toutes les 5 minutes
	},
});

// Configurer le comportement de connexion par défaut
authClient.signIn.email = async (params) => {
	return authClient.signIn.email({
		...params,
		rememberMe: true, // Toujours activer la persistance
	});
};

export const { useSession } = authClient;
