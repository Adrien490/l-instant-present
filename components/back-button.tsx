"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function BackButton() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const iconVariants = {
		initial: { x: -10, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: 10, opacity: 0 },
	};

	return (
		<motion.div
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.2 }}
		>
			<Button
				onClick={() => startTransition(() => router.back())}
				variant="ghost"
				size="icon"
				className={cn(
					// Dimensions et forme
					"w-11 h-11 rounded-xl",
					// Couleurs et effets
					"bg-background/70 hover:bg-accent/80",
					"border border-border/10",
					"shadow-sm hover:shadow-md",
					// Effets de verre
					"backdrop-blur-md",
					"supports-[backdrop-filter]:bg-background/60",
					// Interactions
					"active:scale-95",
					"transition-all duration-200",
					"tap-highlight-transparent",
					// État désactivé
					"disabled:opacity-50 disabled:cursor-not-allowed",
					// Groupe pour les effets
					"group relative overflow-hidden"
				)}
				aria-label="Retour"
				disabled={isPending}
			>
				{/* Effet de brillance au hover */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />

				{/* Conteneur de l'icône avec gestion de l'état */}
				<div className="relative">
					<AnimatePresence mode="wait">
						{isPending ? (
							<motion.div
								key="loader"
								variants={iconVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								className="text-primary/80"
							>
								<Loader2 className="h-5 w-5 animate-spin" />
							</motion.div>
						) : (
							<motion.div
								key="back"
								variants={iconVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								className="text-foreground/80"
							>
								<ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5 group-active:translate-x-0" />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Effet de ripple au clic */}
				<div className="absolute inset-0 pointer-events-none group-active:bg-white/10 transition-colors duration-300 rounded-xl" />
			</Button>
		</motion.div>
	);
}
