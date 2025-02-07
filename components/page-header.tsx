import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
}

export default async function PageHeader({
	title,
	description,
	actions,
	className,
	...props
}: PageHeaderProps) {
	return (
		<header
			className={cn(
				"sticky top-0 z-50",
				"bg-background/80 backdrop-blur-sm",
				"w-full border-b",
				"pt-safe-top",
				className
			)}
			{...props}
		>
			<div className="flex h-16 md:h-20 items-center justify-between gap-6">
				{/* Partie gauche avec titre */}
				<div className="flex flex-1 items-center min-w-0">
					<div className="min-w-0 flex-1">
						<h1 className="text-xl font-semibold leading-tight tracking-tight truncate md:text-3xl">
							{title}
						</h1>
						{description && (
							<p className="mt-2 text-base text-muted-foreground line-clamp-2 md:text-lg">
								{description}
							</p>
						)}
					</div>
				</div>

				{/* Partie droite avec actions */}
				{actions && (
					<div className="flex items-center ml-6 flex-shrink-0">{actions}</div>
				)}
			</div>
		</header>
	);
}
