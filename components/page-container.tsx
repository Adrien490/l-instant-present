"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
	children: React.ReactNode;
	className?: string;
}

export default function PageContainer({
	children,
	className,
	...props
}: PageContainerProps) {
	const pathname = usePathname();

	const variants = {
		hidden: {
			opacity: 0,
			y: 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: 10,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				variants={variants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className={cn(
					"w-full h-full",
					"overflow-y-auto overflow-x-hidden",
					"px-4 pb-4",
					"relative",
					className
				)}
				{...props}
			>
				{/* Contenu de la page */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.2 }}
					className="relative"
				>
					{children}
				</motion.div>

				{/* Indicateur de progression */}
				<motion.div
					className="fixed top-0 left-0 right-0 h-0.5 bg-primary/10 origin-left z-50"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 0.3 }}
				/>
			</motion.div>
		</AnimatePresence>
	);
}
