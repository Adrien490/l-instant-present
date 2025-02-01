import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Logo from "./logo";
import UserAvatar from "./user-avatar";

export default async function AppHeader() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<header className={cn("w-full border-b")}>
			<div className="px-4">
				<div className="h-14 flex items-center justify-between gap-4">
					<div className="flex flex-col justify-center min-w-0">
						<Logo className="text-base" />
						<p className="text-sm text-muted-foreground"></p>
					</div>
					<div className="flex items-center gap-2">
						<UserAvatar user={session?.user} />
					</div>
				</div>
			</div>
		</header>
	);
}
