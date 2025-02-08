"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface FloatingButtonProps {
	href: string;
	label: string;
	variant?: "primary" | "secondary" | "gradient";
	className?: string;
	children: React.ReactNode;
	showLabel?: boolean;
}

export default function FloatingButton({
	href,
	label,
	variant = "primary",
	className,
	children,
	showLabel = false,
}: FloatingButtonProps) {
	const buttonVariants = {
		primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
		secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
		gradient:
			"bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground",
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ y: 80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 80, opacity: 0 }}
				transition={{
					type: "spring",
					stiffness: 400,
					damping: 30,
				}}
				className="fixed bottom-24 right-4 z-50"
			>
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="relative"
				>
					{/* Effet de glow derrière le bouton */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className={cn(
							"absolute inset-0 rounded-full blur-xl",
							variant === "primary" && "bg-primary/20",
							variant === "secondary" && "bg-secondary/20",
							variant === "gradient" &&
								"bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
						)}
					/>

					<Button
						asChild
						className={cn(
							showLabel ? "px-6 min-w-[140px]" : "h-14 w-14",
							"rounded-full",
							buttonVariants[variant],
							"shadow-lg hover:shadow-xl shadow-black/10 hover:shadow-black/20",
							"flex items-center justify-center gap-2",
							"group overflow-hidden",
							"relative backdrop-blur-sm",
							"transition-shadow duration-300 ease-in-out",
							className
						)}
					>
						<Link href={href}>
							<div className="flex items-center gap-2 relative z-10">
								{/* Icône avec effet de rotation au hover */}
								<motion.div
									whileHover={{ rotate: [0, -10, 10, -10, 0] }}
									transition={{ duration: 0.4 }}
								>
									{children}
								</motion.div>

								{/* Label visible si showLabel est true */}
								{showLabel && (
									<motion.span
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className="font-medium whitespace-nowrap"
									>
										{label}
									</motion.span>
								)}

								{/* Label pour accessibilité */}
								{!showLabel && <span className="sr-only">{label}</span>}
							</div>

							{/* Effet de brillance dynamique */}
							<div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
							</div>

							{/* Effet de pulse autour du bouton */}
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: [0, 0.2, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "loop",
								}}
								className={cn(
									"absolute inset-0 rounded-full",
									variant === "primary" && "bg-primary",
									variant === "secondary" && "bg-secondary",
									variant === "gradient" &&
										"bg-gradient-to-r from-primary to-secondary"
								)}
								style={{ scale: 1.2 }}
							/>
						</Link>
					</Button>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
