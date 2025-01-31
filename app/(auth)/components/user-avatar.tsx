"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import Link from "next/link";
import { use } from "react";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	userPromise: Promise<User | null>;
}

const avatarSizes = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-14 w-14",
} as const;

function getUserInitials(
	nom: string | null | undefined,
	email: string | null | undefined
): string {
	if (nom) {
		return nom
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}
	return email?.substring(0, 2).toUpperCase() || "??";
}

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
