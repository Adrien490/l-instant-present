import { cn } from "@/lib/utils";

interface EmptyPlaceholderProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	className?: string;
}

export default function EmptyPlaceholder({
	icon,
	title,
	description,
	className,
}: EmptyPlaceholderProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center",
				className
			)}
		>
			{icon}
			<div>
				<p className="text-base font-medium">{title}</p>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}
