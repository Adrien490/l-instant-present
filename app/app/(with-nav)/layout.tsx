import BottomNav from "@/components/bottom-nav";
import { mainMenuItems } from "@/lib/menus";

export default async function AppLayoutWithNav({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col pb-16">
			<main className="flex-1">{children}</main>
			<BottomNav items={mainMenuItems} />
		</div>
	);
}
