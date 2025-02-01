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
				"fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t safe-area-bottom",
				className
			)}
			aria-label="Navigation principale"
		>
			<div className="mx-auto max-w-md">
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
									"flex flex-col items-center justify-center gap-1",
									"active:scale-95 transition-transform tap-highlight-transparent",
									isActive
										? "text-primary"
										: "text-muted-foreground hover:text-primary"
								)}
								aria-current={isActive ? "page" : undefined}
							>
								<Icon
									className={cn(
										"h-5 w-5",
										isActive
											? "text-primary"
											: "text-muted-foreground group-hover:text-primary"
									)}
									aria-hidden="true"
								/>
								<span className="text-[11px] leading-none">{item.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
