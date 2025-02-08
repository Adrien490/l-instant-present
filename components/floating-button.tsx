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
import { useState } from "react";

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
	const { scrollY } = useScroll();
	let lastScrollY = 0;

	useMotionValueEvent(scrollY, "change", (latest) => {
		const isScrollingDown = latest > lastScrollY;
		const isNearBottom =
			window.innerHeight + latest >=
			document.documentElement.scrollHeight - 100;

		setIsVisible(!isScrollingDown || isNearBottom || latest < 100);
		lastScrollY = latest;
	});

	const buttonVariants = {
		primary: cn(
			"bg-primary hover:bg-primary/90 text-primary-foreground",
			"data-[active=true]:bg-primary/80"
		),
		secondary: cn(
			"bg-secondary hover:bg-secondary/90 text-secondary-foreground",
			"data-[active=true]:bg-secondary/80"
		),
		gradient: cn(
			"bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground",
			"data-[active=true]:opacity-90"
		),
		glass: cn(
			"bg-background/60 backdrop-blur-xl text-foreground",
			"hover:bg-background/80",
			"border border-border/50",
			"data-[active=true]:bg-background/90"
		),
	};

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					initial={{ y: 20, scale: 0.8, opacity: 0 }}
					animate={{ y: 0, scale: 1, opacity: 1 }}
					exit={{ y: 20, scale: 0.8, opacity: 0 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 25,
					}}
					className="fixed bottom-24 right-4 z-50"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="relative"
					>
						{/* Glow Effect */}
						<div
							className={cn(
								"absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300",
								"group-hover:opacity-100",
								variant === "primary" && "bg-primary/20 blur-lg",
								variant === "secondary" && "bg-secondary/20 blur-lg",
								variant === "gradient" &&
									"bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-lg",
								variant === "glass" && "bg-background/10 blur-md"
							)}
						/>

						<Button
							asChild
							className={cn(
								"h-14 w-14 rounded-2xl",
								buttonVariants[variant],
								"relative group",
								"overflow-hidden",
								"shadow-lg hover:shadow-xl",
								"transition-all duration-300",
								"active:scale-95",
								className
							)}
						>
							<Link href={href}>
								<motion.div
									className="relative z-10 p-3"
									whileHover={{ rotate: [0, -10, 10, -10, 0] }}
									transition={{ duration: 0.5 }}
								>
									{children}
								</motion.div>

								<span className="sr-only">{label}</span>

								{/* Ripple effect on hover */}
								<div className="absolute inset-0 rounded-2xl">
									<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>

								{/* Active state overlay */}
								<div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity rounded-2xl" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
