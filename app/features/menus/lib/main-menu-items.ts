import NavItem from "../types/nav-item";

const mainMenuItems: NavItem[] = [
	{
		href: "/app",
		label: "Accueil",
		iconType: "home",
	},
	{
		href: "/app/my-groups",
		label: "Mes groupes",
		iconType: "users",
	},
	{
		href: "/app/invites",
		label: "Invitations",
		iconType: "mail",
	},
	{
		href: "/app/help",
		label: "Aide",
		iconType: "help-circle",
	},
];

export default mainMenuItems;
