"use client";

import UserAvatar from "@/app/(auth)/components/user-avatar";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import { Suspense } from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	userPromise: Promise<User | null>;
}

export default function PageHeader({
	title,
	description,
	userPromise,
	className,
	...props
}: PageHeaderProps) {
	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				className
			)}
			{...props}
		>
			<div className="h-14 flex items-center justify-between gap-4 px-4">
				<div className="flex flex-col justify-center min-w-0">
					<div className="flex items-center gap-2">
						<h1 className="text-base font-semibold leading-tight truncate">
							{title}
						</h1>
					</div>
					{description && (
						<p className="text-xs text-muted-foreground truncate">
							{description}
						</p>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Suspense
						fallback={
							<div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
						}
					>
						<UserAvatar userPromise={userPromise} size="sm" />
					</Suspense>
				</div>
			</div>
		</header>
	);
}
