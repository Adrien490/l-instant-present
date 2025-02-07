import { cn } from "@/lib/utils";

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	className?: string;
};

export default function PageContainer({
	children,
	className,
	...props
}: PageContainerProps) {
	return (
		<main
			className={cn(
				"w-full h-full overflow-y-auto overflow-x-hidden",
				"px-4 pb-4",
				className
			)}
			{...props}
		>
			{children}
		</main>
	);
}
