import BottomNav from "@/app/features/menus/components/bottom-nav";
import createGroupMenuItems from "@/app/features/menus/lib/group-menu";

type Props = {
	params: Promise<{
		groupId: string;
	}>;
	children: React.ReactNode;
};

export default async function WithNavLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const groupId = resolvedParams.groupId;
	const groupMenuItems = createGroupMenuItems(groupId);

	return (
		<div className="flex flex-col h-full">
			{children}
			<BottomNav items={groupMenuItems} />
		</div>
	);
}
