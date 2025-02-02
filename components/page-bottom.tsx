import { cn } from "@/lib/utils";

interface PageBottomProps {
	children: React.ReactNode;
	className?: string;
}

export default function PageBottom({ children, className }: PageBottomProps) {
	return (
		<div
			className={cn(
				"fixed inset-x-0 bottom-24 bg-background border-t",
				"pb-[max(env(safe-area-inset-bottom),16px)] p-4",
				"z-40 shadow-lg",
				className
			)}
		>
			<div className="mx-auto max-w-2xl">{children}</div>
		</div>
	);
}
