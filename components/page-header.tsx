"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface PageHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	showBackButton?: boolean;
	isLoading?: boolean;
}

export default function PageHeader({
	title,
	description,
	className,
	showBackButton = false,
	isLoading = false,
	...props
}: PageHeaderProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				"sticky top-0 z-50 w-full",
				"bg-gradient-to-b from-background via-background/95 to-background/90",
				"backdrop-blur supports-[backdrop-filter]:bg-background/60",
				"border-b border-border/40",
				"transition-all duration-200 ease-in-out",
				className
			)}
			{...props}
		>
			<div className="py-2.5">
				<div className="flex h-14 items-center gap-4 max-w-7xl mx-auto">
					<div className="flex flex-1 items-center min-w-0 gap-3">
						{showBackButton && (
							<Button
								onClick={() => startTransition(() => router.back())}
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-full w-10 h-10",
									"hover:bg-accent hover:text-accent-foreground",
									"active:scale-95",
									"transition-all duration-200",
									"tap-highlight-transparent"
								)}
								aria-label="Retour"
								disabled={isPending}
							>
								{isPending ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<ChevronLeft className="h-5 w-5" />
								)}
							</Button>
						)}

						<div className="min-w-0 flex-1">
							{isLoading ? (
								<div className="space-y-2">
									<Skeleton className="h-6 w-32" />
									{description && <Skeleton className="h-4 w-24" />}
								</div>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 }}
								>
									<h1
										className={cn(
											"text-base font-semibold leading-tight tracking-tight",
											"truncate md:text-xl",
											"bg-clip-text text-transparent bg-gradient-to-r",
											"from-foreground to-foreground/80"
										)}
									>
										{title}
									</h1>
									{description && (
										<div className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
											{description}
										</div>
									)}
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</div>

			<motion.div
				initial={{ scaleX: 0 }}
				animate={{ scaleX: isPending ? 1 : 0 }}
				transition={{ duration: 0.5 }}
				className="h-0.5 bg-primary/20 w-full origin-left"
			/>
		</motion.header>
	);
}
