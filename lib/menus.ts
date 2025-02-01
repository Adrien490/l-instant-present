"use client";

import {
	HelpCircle,
	Home,
	LucideIcon,
	Mail,
	Medal,
	PlusCircle,
	Trophy,
	Users2,
} from "lucide-react";

export interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
	primary?: boolean;
}

export const mainMenuItems: NavItem[] = [
	{
		href: "/app",
		label: "Accueil",
		icon: Home,
	},
	{
		href: "/app/my-groups",
		label: "Mes groupes",
		icon: Users2,
	},
	{
		href: "/app/invites",
		label: "Invitations",
		icon: Mail,
	},
	{
		href: "/app/help",
		label: "Aide",
		icon: HelpCircle,
	},
];

export const challengeMenuItems: NavItem[] = [
	{
		href: "/app",
		label: "Accueil",
		icon: Home,
	},
	{
		href: "/app/challenges",
		label: "Défis",
		icon: Medal,
	},
	{
		href: "/app/submit",
		label: "Soumettre",
		icon: PlusCircle,
		primary: true,
	},
	{
		href: "/app/community",
		label: "Communauté",
		icon: Users2,
	},
	{
		href: "/app/leaderboard",
		label: "Classement",
		icon: Trophy,
	},
];
