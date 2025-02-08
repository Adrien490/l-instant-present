"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FloatingButtonProps {
	href: string;
	label: string;
	variant?: "primary" | "secondary" | "gradient" | "glass";
	className?: string;
	children: React.ReactNode;
}

export default function FloatingButton({
	href,
	label,
	variant = "primary",
	className,
	children,
}: FloatingButtonProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [isExpanded, setIsExpanded] = useState(false);
	const { scrollY } = useScroll();
	const [lastScrollY, setLastScrollY] = useState(0);

	// Cleanup et initialisation
	useEffect(() => {
		setLastScrollY(window.scrollY);
		return () => {
			setIsVisible(true);
			setIsExpanded(false);
		};
	}, []);

	// Gestion optimisée du scroll
	useMotionValueEvent(scrollY, "change", (latest) => {
		const isScrollingDown = latest > lastScrollY;
		const isNearBottom =
			window.innerHeight + latest >=
			document.documentElement.scrollHeight - 200;
		const isNearTop = latest < 100;

		if (isNearTop) {
			setIsExpanded(false);
			setIsVisible(true);
		} else if (isNearBottom) {
			setIsExpanded(true);
			setIsVisible(true);
		} else {
			setIsExpanded(!isScrollingDown);
			setIsVisible(!isScrollingDown);
		}

		setLastScrollY(latest);
	});

	const buttonVariants = {
		primary: cn(
			"bg-primary/95 hover:bg-primary text-primary-foreground",
			"data-[active=true]:bg-primary/90"
		),
		secondary: cn(
			"bg-secondary/95 hover:bg-secondary text-secondary-foreground",
			"data-[active=true]:bg-secondary/90"
		),
		gradient: cn(
			"bg-gradient-to-r from-primary/95 via-primary to-primary/95 text-primary-foreground",
			"data-[active=true]:opacity-90"
		),
		glass: cn(
			"bg-background/80 backdrop-blur-xl text-foreground",
			"hover:bg-background/90",
			"border border-border/50",
			"data-[active=true]:bg-background/95"
		),
	};

	const motionConfig = {
		initial: { y: 20, scale: 0.8, opacity: 0 },
		animate: { y: 0, scale: 1, opacity: 1 },
		exit: { y: 20, scale: 0.8, opacity: 0 },
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 25,
		},
	};

	return (
		<AnimatePresence mode="wait" initial={false}>
			{isVisible && (
				<motion.div
					{...motionConfig}
					className="fixed bottom-24 right-4 z-50 select-none"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="relative"
					>
						{/* Glow Effect avec performance optimisée */}
						<div
							className={cn(
								"absolute -inset-1 rounded-2xl opacity-0 will-change-transform",
								"group-hover:opacity-100 transition-opacity duration-300",
								variant === "primary" && "bg-primary/20 blur-lg",
								variant === "secondary" && "bg-secondary/20 blur-lg",
								variant === "gradient" &&
									"bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-lg",
								variant === "glass" && "bg-background/10 blur-md"
							)}
						/>

						<motion.div
							animate={{
								width: isExpanded ? "auto" : "3.5rem",
							}}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 30,
								mass: 0.8,
							}}
						>
							<Button
								asChild
								className={cn(
									"h-14 rounded-2xl",
									buttonVariants[variant],
									"relative group",
									"overflow-hidden",
									"shadow-lg hover:shadow-xl",
									"transition-all duration-200",
									"active:scale-95",
									"tap-highlight-transparent",
									isExpanded && "px-6",
									className
								)}
							>
								<Link href={href} className="select-none">
									<div className="flex items-center gap-3">
										<motion.div
											className="relative z-10"
											whileHover={{ rotate: [0, -10, 10, -10, 0] }}
											transition={{
												duration: 0.4,
												ease: "easeInOut",
											}}
										>
											{children}
										</motion.div>

										<AnimatePresence mode="wait">
											{isExpanded && (
												<motion.span
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: 10 }}
													transition={{
														duration: 0.2,
														ease: "easeOut",
													}}
													className="text-sm font-medium whitespace-nowrap overflow-hidden"
												>
													{label}
												</motion.span>
											)}
										</AnimatePresence>
									</div>

									{/* Optimisation des effets visuels */}
									<div className="absolute inset-0 rounded-2xl pointer-events-none">
										<div
											className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
											style={{
												willChange: "opacity",
											}}
										/>
									</div>

									<div
										className="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-active:opacity-100 transition-opacity"
										style={{
											willChange: "opacity",
										}}
									/>
								</Link>
							</Button>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
