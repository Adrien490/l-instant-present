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
		<div className={cn("bg-background", className)} {...props}>
			<div className="py-4">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold leading-tight truncate">
							{title}
						</h1>
						{description && (
							<p className="mt-1 text-sm text-muted-foreground line-clamp-2">
								{description}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
