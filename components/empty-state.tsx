"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	className?: string;
}

export default function EmptyState({
	icon,
	title,
	description,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center px-4",
				className
			)}
		>
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="rounded-2xl bg-muted/60 p-5">{icon}</div>
				<div className="space-y-1.5">
					<p className="text-base/relaxed font-medium text-foreground/80">
						{title}
					</p>
					<p className="text-sm/relaxed text-muted-foreground max-w-[260px]">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}
