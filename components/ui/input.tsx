import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base shadow-sm transition-colors",
					"placeholder:text-muted-foreground/60",
					"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"file:border-0 file:bg-transparent file:text-sm file:font-medium",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
