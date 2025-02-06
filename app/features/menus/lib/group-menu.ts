const createGroupMenuItems = (groupId: string) => [
	{
		href: `/app/my-groups/${groupId}/challenge-periods`,
		label: "Périodes",
		iconType: "calendar",
	},
	{
		href: `/app/my-groups/${groupId}/members`,
		label: "Membres",
		iconType: "users",
	},
	{
		href: `/app/my-groups/${groupId}/details`,
		label: "Infos",
		iconType: "info",
	},
];

export default createGroupMenuItems;
