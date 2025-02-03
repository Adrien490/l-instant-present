"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
}

export default function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center p-4 safe-area-x touch-action-pan-y",
				className
			)}
		>
			<div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
				<div className="rounded-2xl bg-muted/60 p-4 transform-gpu">{icon}</div>
				<div className="spacing-2025-compact">
					<p className="text-2xl font-medium leading-tight tracking-tight md:tracking-normal text-foreground/80">
						{title}
					</p>
					<p className="text-base leading-normal md:leading-relaxed antialiased text-muted-foreground max-w-[260px]">
						{description}
					</p>
				</div>
				{action && (
					<div className="w-full max-w-[260px] touch-target-2025">{action}</div>
				)}
			</div>
		</div>
	);
}
