import { cn } from "@/lib/utils";

type PageContainerProps = {
	children: React.ReactNode;
	className?: string;
	props?: React.HTMLAttributes<HTMLDivElement>;
};

export default function PageContainer({
	children,
	className,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				"w-full h-full overflow-y-auto overflow-x-hidden",
				"container",
				"px-4 pb-4",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
