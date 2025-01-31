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
			className={cn("min-h-[100dvh] mx-auto w-full px-4", className)}
			{...props}
		>
			{children}
		</div>
	);
}
