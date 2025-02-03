"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
	user: {
		id: string;
		name?: string | null;
		image?: string | null;
	};
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-12 w-12",
};

export default function UserAvatar({ user, size = "md", className }: Props) {
	const initials = user.name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<Link
			href={`/app/profile/${user.id}`}
			className={cn(
				"group relative touch-target-2025 transition-transform hover:scale-105 transform-gpu",
				className
			)}
		>
			<Avatar className={cn(sizeClasses[size], "ring-2 ring-background")}>
				<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
				<AvatarFallback className="text-sm font-medium">
					{initials ?? "?"}
				</AvatarFallback>
			</Avatar>
		</Link>
	);
}
