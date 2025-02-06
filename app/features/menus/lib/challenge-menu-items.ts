import NavItem from "../types/nav-item";

const challengePeriodMenuItems: NavItem[] = [
	{
		href: "/app",
		label: "Accueil",
		iconType: "home",
	},
	{
		href: "/app/challenges",
		label: "Défis",
		iconType: "medal",
	},
	{
		href: "/app/submit",
		label: "Soumettre",
		iconType: "plus-circle",
	},
	{
		href: "/app/community",
		label: "Communauté",
		iconType: "users",
	},
	{
		href: "/app/leaderboard",
		label: "Classement",
		iconType: "trophy",
	},
];

export default challengePeriodMenuItems;
