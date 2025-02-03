"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
}

export default function PageHeader({
	title,
	description,
	className,
	...props
}: PageHeaderProps) {
	return (
		<div className={cn("bg-background safe-area-x", className)} {...props}>
			<div className="py-4 space-y-4">
				<div className="flex items-start justify-between gap-4 sm:gap-6">
					<div className="min-w-0 flex-1 spacing-2025-compact">
						<h1 className="text-2xl font-medium leading-tight tracking-tight md:tracking-normal truncate">
							{title}
						</h1>
						{description && (
							<div className="text-base leading-normal md:leading-relaxed antialiased text-muted-foreground line-clamp-2">
								{description}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
