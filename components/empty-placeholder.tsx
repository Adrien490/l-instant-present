"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";

interface EmptyPlaceholderProps
	extends Omit<HTMLMotionProps<"div">, "title" | "children"> {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
	iconClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export default function EmptyPlaceholder({
	icon,
	title,
	description,
	action,
	className,
	iconClassName,
	titleClassName,
	descriptionClassName,
	...props
}: EmptyPlaceholderProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
			className={cn(
				"relative flex flex-col items-center justify-center",
				"min-h-[350px] w-full max-w-md mx-auto",
				"px-8 py-12",
				"rounded-[2.5rem]",
				"bg-gradient-to-b from-background via-background/95 to-background/90",
				"border border-border/40",
				"shadow-2xl shadow-background/5",
				"backdrop-blur-xl",
				className
			)}
			{...props}
		>
			{/* Conteneur de l'icône avec effet de profondeur */}
			<motion.div
				initial={{ scale: 0.5, y: 10 }}
				animate={{ scale: 1, y: 0 }}
				transition={{
					type: "spring",
					stiffness: 200,
					damping: 20,
					delay: 0.1,
				}}
				className={cn(
					"relative mb-8",
					"flex items-center justify-center",
					"w-24 h-24",
					iconClassName
				)}
			>
				{/* Cercles décoratifs derrière l'icône */}
				<div className="absolute inset-0 scale-[0.8]">
					<motion.div
						className="absolute inset-0 rounded-full bg-primary/5"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.5, 0.3],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute inset-0 rounded-full bg-secondary/5"
						animate={{
							scale: [1.2, 1, 1.2],
							opacity: [0.5, 0.3, 0.5],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>

				{/* Container de l'icône avec effet de glassmorphism */}
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className={cn(
						"relative z-10",
						"w-16 h-16",
						"rounded-[1.25rem]",
						"flex items-center justify-center",
						"bg-gradient-to-br from-background/80 to-background/40",
						"border border-border/50",
						"shadow-lg shadow-background/5",
						"backdrop-blur-md"
					)}
				>
					<div className="w-8 h-8 text-foreground/80">{icon}</div>
				</motion.div>
			</motion.div>

			{/* Conteneur de texte avec animations décalées */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="relative z-10 text-center space-y-4 max-w-[85%]"
			>
				<motion.h3
					className={cn(
						"text-xl font-semibold",
						"bg-clip-text text-transparent",
						"bg-gradient-to-b from-foreground to-foreground/80",
						titleClassName
					)}
				>
					{title}
				</motion.h3>

				<motion.p
					className={cn(
						"text-base text-muted-foreground",
						"leading-relaxed",
						descriptionClassName
					)}
				>
					{description}
				</motion.p>
			</motion.div>

			{/* Conteneur du bouton d'action */}
			{action && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="mt-8 w-full max-w-[240px]"
				>
					{action}
				</motion.div>
			)}

			{/* Effet de grain subtil */}
			<div
				className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>
		</motion.div>
	);
}
