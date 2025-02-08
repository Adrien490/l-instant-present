import getUserInitials from "@/app/features/users/lib/get-user-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";

type Props = {
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-12 w-12",
};

export default async function UserAvatar({ size = "md", className }: Props) {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<Link
			href={`/app/profile/${session?.user.id}`}
			className={cn(
				"group relative touch-target-2025 transition-transform hover:scale-105 active:scale-95",
				className
			)}
		>
			<Avatar className={cn(sizeClasses[size], "ring-2 ring-background")}>
				<AvatarImage
					src={session?.user.image ?? ""}
					alt={session?.user.name ?? ""}
				/>
				<AvatarFallback className="text-sm font-medium">
					{getUserInitials(session?.user.name ?? "") ?? "?"}
				</AvatarFallback>
			</Avatar>
		</Link>
	);
}
