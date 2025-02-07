"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export default function PageContainer({
	children,
	className,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				"w-full h-full overflow-y-auto overflow-x-hidden",
				"px-4 sm:px-6",
				"pl-safe-left pr-safe-right pt-safe-top pb-safe-bottom",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
