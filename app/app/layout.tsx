import AppHeader from "@/components/app-header";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-full">
			<AppHeader />
			{children}
		</div>
	);
}
