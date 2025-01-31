"use client";

import UserAvatar from "@/app/(auth)/components/user-avatar";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import { Suspense } from "react";

interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	userPromise: Promise<User | null>;
}

export default function AppHeader({
	title,
	description,
	userPromise,
	className,
	...props
}: AppHeaderProps) {
	return (
		<header
			className={cn(
				"border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				className
			)}
			{...props}
		>
			<div className="px-4 h-14 flex items-center justify-between gap-4">
				<div className="flex flex-col justify-center min-w-0">
					<h1 className="text-base font-semibold leading-tight truncate">
						{title}
					</h1>
					{description && (
						<p className="text-xs text-muted-foreground truncate">
							{description}
						</p>
					)}
				</div>
				<Suspense fallback={<div className="w-8 h-8" />}>
					<UserAvatar userPromise={userPromise} size="sm" />
				</Suspense>
			</div>
		</header>
	);
}
