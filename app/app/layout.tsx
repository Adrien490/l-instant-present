import AppHeader from "@/components/app-header";
import { Suspense } from "react";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<Suspense
				fallback={<div className="h-14 w-full bg-muted animate-pulse" />}
			>
				<AppHeader />
			</Suspense>
			{children}
		</div>
	);
}
