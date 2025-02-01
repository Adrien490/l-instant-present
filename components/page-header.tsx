"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export default function PageHeader({
	title,
	description,
	action,
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
					{action && <div className="flex items-center shrink-0">{action}</div>}
				</div>
			</div>
		</div>
	);
}
