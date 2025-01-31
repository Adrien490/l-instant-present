"use client";

import { cn } from "@/lib/utils";
import {
	Home,
	LucideIcon,
	Medal,
	PlusCircle,
	Trophy,
	Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
	primary?: boolean;
}

const items: NavItem[] = [
	{
		href: "/app",
		label: "Accueil",
		icon: Home,
	},
	{
		href: "/app/challenges",
		label: "Défis",
		icon: Medal,
	},
	{
		href: "/app/submit",
		label: "Soumettre",
		icon: PlusCircle,
		primary: true,
	},
	{
		href: "/app/community",
		label: "Communauté",
		icon: Users2,
	},
	{
		href: "/app/leaderboard",
		label: "Classement",
		icon: Trophy,
	},
];

export default function MobileNav() {
	const pathname = usePathname();

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t safe-area-bottom"
			aria-label="Navigation principale"
		>
			<div className="grid grid-cols-5 h-16 max-w-md mx-auto">
				{items.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (item.primary) {
						return (
							<div key={item.href} className="relative flex justify-center">
								<Link
									href={item.href}
									className="absolute -top-6 flex flex-col items-center"
									aria-label={`${item.label} - Action principale`}
								>
									<span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-md transition-shadow">
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
							className={cn(
								"flex flex-col items-center justify-center py-1",
								"font-medium transition-colors",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-primary"
							)}
							aria-current={isActive ? "page" : undefined}
						>
							<Icon
								className={cn(
									"h-5 w-5 mb-1",
									isActive ? "text-primary" : "text-muted-foreground"
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
