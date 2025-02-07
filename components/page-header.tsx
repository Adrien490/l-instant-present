"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface PageHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
	showBackButton?: boolean;
}

export default function PageHeader({
	title,
	description,
	actions,
	className,
	showBackButton = false,
	...props
}: PageHeaderProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<header
			className={cn(
				"w-full bg-background/95 backdrop-blur-sm",
				"border-b rounded-b-xl mb-3 md:mb-4",
				className
			)}
			{...props}
		>
			<div className="flex h-14 md:h-20 items-center justify-between gap-4">
				<div className="flex flex-1 items-center min-w-0 gap-3">
					{showBackButton && (
						<button
							onClick={() =>
								startTransition(() => {
									router.back();
								})
							}
							className={cn(
								"flex items-center justify-center rounded-lg -ml-2 p-2",
								"text-muted-foreground hover:text-foreground",
								"active:bg-muted/40 transition-colors duration-200",
								"tap-highlight-transparent md:hidden"
							)}
							aria-label="Retour"
						>
							{isPending ? (
								<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
							) : (
								<ChevronLeft className="h-5 w-5" />
							)}
						</button>
					)}
					<div className="min-w-0 flex-1">
						<h1 className="text-lg font-semibold leading-tight tracking-tight truncate md:text-3xl">
							{title}
						</h1>
						{description && (
							<div className="mt-1 md:mt-2 text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 md:text-lg">
								{description}
							</div>
						)}
					</div>
				</div>

				{actions && (
					<div className="flex items-center ml-4 md:ml-6 flex-shrink-0">
						{actions}
					</div>
				)}
			</div>
		</header>
	);
}
