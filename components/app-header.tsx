import { cn } from "@/lib/utils";
import UserAvatar from "../app/features/users/components/user-avatar";
import Logo from "./logo";

export default async function AppHeader() {
	return (
		<header className={cn("w-full")}>
			<div className="px-4 py-2">
				<div className="h-16 flex items-center justify-between gap-4">
					<div className="flex flex-col justify-center min-w-0">
						<Logo className="text-lg" />
						<p className="text-sm text-muted-foreground"></p>
					</div>
					<div className="flex items-center gap-3">
						<UserAvatar />
					</div>
				</div>
			</div>
		</header>
	);
}
