import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
}

export default function PageHeader({
	title,
	description,
	actions,
	className,
	...props
}: PageHeaderProps) {
	return (
		<header
			className={cn(
				"w-full bg-background/95 backdrop-blur-sm",
				"border-b rounded-b-xl mb-3 md:mb-4",
				className
			)}
			{...props}
		>
			<div className="flex h-14 md:h-20 items-center justify-between gap-4 px-4">
				{/* Titre et description */}
				<div className="flex flex-1 items-center min-w-0">
					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold leading-tight tracking-tight truncate md:text-3xl">
							{title}
						</h1>
						{description && (
							<p className="mt-1 md:mt-2 text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 md:text-lg">
								{description}
							</p>
						)}
					</div>
				</div>

				{/* Actions */}
				{actions && (
					<div className="flex items-center ml-4 md:ml-6 flex-shrink-0">
						{actions}
					</div>
				)}
			</div>
		</header>
	);
}
