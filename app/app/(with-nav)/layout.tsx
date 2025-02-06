import BottomNav from "@/app/features/menus/components/bottom-nav";
import mainMenuItems from "@/app/features/menus/lib/main-menu-items";

export default function WithNavLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full">
			{children}
			<BottomNav items={mainMenuItems} />
		</div>
	);
}
