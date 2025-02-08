"use client";

import getUserInitials from "@/app/features/users/lib/get-user-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import Link from "next/link";
import { use } from "react";

type Props = {
	userPromise: Promise<User | undefined>;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-12 w-12",
};

export default function UserAvatar({
	size = "md",
	className,
	userPromise,
}: Props) {
	const user = use(userPromise);

	if (!user) {
		return null;
	}

	return (
		<Link
			href={`/app/profile/${user.id}`}
			className={cn(
				"group relative touch-target-2025 transition-transform hover:scale-105 active:scale-95",
				className
			)}
		>
			<Avatar className={cn(sizeClasses[size], "ring-2 ring-background")}>
				<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
				<AvatarFallback className="text-sm font-medium">
					{getUserInitials(user.name ?? "") ?? "?"}
				</AvatarFallback>
			</Avatar>
		</Link>
	);
}
