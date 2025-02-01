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
		trigger({ light: true }); // Retour haptique léger au clic
	};

	return (
		<nav
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t rounded-t-3xl safe-area-bottom",
				className
			)}
			aria-label="Navigation principale"
		>
			<div
				className={cn(
					"grid h-16 max-w-md mx-auto",
					`grid-cols-${items.length}`
				)}
			>
				{items.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (item.primary) {
						return (
							<div key={item.href} className="relative flex justify-center">
								<Link
									href={item.href}
									onClick={handleItemClick}
									className="absolute -top-6 flex flex-col items-center group active:scale-90 transition-transform"
									aria-label={`${item.label} - Action principale`}
								>
									<span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:shadow-md transition-shadow">
										<Icon className="h-6 w-6" aria-hidden="true" />
									</span>
									<span className="text-[11px] leading-none font-medium mt-[3px] translate-y-1">
										{item.label}
									</span>
								</Link>
							</div>
						);
					}

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={handleItemClick}
							className={cn(
								"flex flex-col items-center justify-center py-1",
								"active:scale-90 transition-transform tap-highlight-transparent",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-primary"
							)}
							aria-current={isActive ? "page" : undefined}
						>
							<Icon
								className={cn(
									"h-5 w-5 mb-1",
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
		</nav>
	);
}
