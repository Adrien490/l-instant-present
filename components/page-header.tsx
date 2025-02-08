"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
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
}: PageHeaderProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<motion.header
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				"sticky top-0 z-50 w-full",
				"bg-gradient-to-b from-background via-background/95 to-background/90",
				"backdrop-blur supports-[backdrop-filter]:bg-background/60",
				"border-b border-border/40",
				"transition-all duration-200 ease-in-out",
				className
			)}
		>
			{/* Container principal */}
			<div className="py-2.5 mx-auto">
				<div className="flex items-center justify-between gap-4 h-14">
					{/* Section gauche avec bouton retour et titre */}
					<div className="flex flex-1 items-center min-w-0 gap-3">
						<AnimatePresence mode="wait">
							{showBackButton && (
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.2 }}
								>
									<Button
										onClick={() => startTransition(() => router.back())}
										variant="ghost"
										size="icon"
										className={cn(
											"rounded-full w-10 h-10",
											"bg-background/80 hover:bg-accent",
											"active:scale-95",
											"transition-all duration-200",
											"tap-highlight-transparent",
											"backdrop-blur-sm"
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
								</motion.div>
							)}
						</AnimatePresence>

						{/* Titre et description */}
						<div className="min-w-0 flex-1">
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className="flex flex-col"
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
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
										className="mt-0.5 text-sm text-muted-foreground line-clamp-1"
									>
										{description}
									</motion.div>
								)}
							</motion.div>
						</div>
					</div>

					{/* Section droite avec actions */}
					{actions && (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
							className="flex items-center gap-2"
						>
							{actions}
						</motion.div>
					)}
				</div>
			</div>

			{/* Barre de progression */}
			<motion.div
				initial={{ scaleX: 0 }}
				animate={{ scaleX: isPending ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				className="h-0.5 bg-primary/20 w-full origin-left"
			/>
		</motion.header>
	);
}
