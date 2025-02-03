import { cn } from "@/lib/utils";
import * as React from "react";

interface EmptyPlaceholderProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
	iconClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export default function EmptyPlaceholder({
	icon,
	title,
	description,
	action,
	className,
	iconClassName,
	titleClassName,
	descriptionClassName,
}: EmptyPlaceholderProps) {
	return (
		<div
			className={cn(
				"flex min-h-[240px] flex-col items-center justify-center gap-6 rounded-xl border border-dashed p-8 text-center",
				className
			)}
		>
			<div className={cn("transform-gpu", iconClassName)}>{icon}</div>
			<div className="space-y-2">
				<p
					className={cn(
						"text-base font-medium leading-normal antialiased",
						titleClassName
					)}
				>
					{title}
				</p>
				<p
					className={cn(
						"text-sm leading-normal antialiased text-muted-foreground",
						descriptionClassName
					)}
				>
					{description}
				</p>
			</div>
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
