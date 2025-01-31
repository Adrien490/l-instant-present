import MobileNav from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<main className="flex-1 pb-16">{children}</main>
			<MobileNav />
		</div>
	);
}
