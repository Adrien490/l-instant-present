import BottomNav from "@/components/bottom-nav";
import { mainMenuItems } from "@/lib/menus";

export default async function AppLayoutWithNav({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<BottomNav items={mainMenuItems} />
		</>
	);
}
