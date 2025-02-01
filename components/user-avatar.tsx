import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getUserInitials } from "@/lib/utils";
import Link from "next/link";

interface UserAvatarProps {
	user:
		| {
				id: string;
				email: string;
				emailVerified: boolean;
				name: string;
				createdAt: Date;
				updatedAt: Date;
				image?: string | null;
		  }
		| null
		| undefined;
	className?: string;
	showLink?: boolean;
}

export default function UserAvatar({
	user,
	className,
	showLink = true,
}: UserAvatarProps) {
	const avatar = (
		<Avatar className={cn("h-8 w-8", className)}>
			<AvatarImage
				src={user?.image || undefined}
				alt={user?.name || "Avatar de l'utilisateur"}
			/>
			<AvatarFallback className="font-medium">
				{getUserInitials(user?.name, user?.email)}
			</AvatarFallback>
		</Avatar>
	);

	if (showLink) {
		return (
			<Link href="/app/profile" className="transition-opacity hover:opacity-80">
				{avatar}
			</Link>
		);
	}

	return avatar;
}
