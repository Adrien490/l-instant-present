"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import Link from "next/link";
import { use } from "react";
import getUserInitials from "../lib/get-user-initials";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	userPromise: Promise<User | null>;
}

const avatarSizes = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-14 w-14",
} as const;

export default function UserAvatar({
	size = "md",
	className,
	userPromise,
}: UserAvatarProps) {
	const user = use(userPromise);

	if (!user) return null;

	return (
		<Link href="/app/profile" className="transition-opacity hover:opacity-80">
			<Avatar className={cn(avatarSizes[size], className)}>
				<AvatarImage
					src={user.image || undefined}
					alt={user.name || "Avatar de l'utilisateur"}
				/>
				<AvatarFallback className="font-medium">
					{getUserInitials(user.name, user.email)}
				</AvatarFallback>
			</Avatar>
		</Link>
	);
}
