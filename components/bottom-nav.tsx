"use client";

import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { NavItem, mainMenuItems } from "@/lib/menus";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
	items: NavItem[];
	className?: string;
}

export default function BottomNav({
	items = mainMenuItems,
	className,
}: BottomNavProps) {
	const pathname = usePathname();
	const { trigger } = useHapticFeedback();

	const handleItemClick = () => {
		trigger({ light: true });
	};

	return (
		<nav
			className={cn(
				"fixed bottom-0 left-0 right-0 border-t rounded-t-3xl bg-background z-50",
				"pb-[max(env(safe-area-inset-bottom),16px)]",
				className
			)}
		>
			<div className="mx-auto max-w-md pointer-events-auto">
				<div className="grid grid-cols-4 h-16">
					{items.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={handleItemClick}
								className={cn(
									"flex flex-col items-center justify-center gap-1 relative",
									"active:opacity-60 transition-all duration-150 tap-highlight-transparent",
									"after:absolute after:bottom-0 after:h-1 after:w-12 after:rounded-full after:transition-all after:duration-200",
									isActive
										? "text-primary after:bg-primary"
										: "text-muted-foreground hover:text-primary after:w-0 hover:after:w-12 after:bg-primary/50"
								)}
								aria-current={isActive ? "page" : undefined}
							>
								<Icon
									className={cn(
										"h-5 w-5 transition-transform duration-200 mb-0.5",
										isActive ? "scale-110" : "scale-100 group-hover:scale-110"
									)}
									aria-hidden="true"
								/>
								<span className="text-[11px] leading-none font-medium antialiased">
									{item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
