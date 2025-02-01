import BottomNav from "@/components/bottom-nav";
import { mainMenuItems } from "@/lib/menus";

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
