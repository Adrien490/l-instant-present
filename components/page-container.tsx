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
				"w-full h-full px-4 overflow-y-auto overflow-x-hidden",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
