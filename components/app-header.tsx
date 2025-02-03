import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Logo from "./logo";
import UserAvatar from "./user-avatar";

export default async function AppHeader() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<header className={cn("w-full border-b")}>
			<div className="px-4 py-2">
				<div className="h-16 flex items-center justify-between gap-4">
					<div className="flex flex-col justify-center min-w-0">
						<Logo className="text-lg" />
						<p className="text-sm text-muted-foreground"></p>
					</div>
					<div className="flex items-center gap-3">
						<UserAvatar
							user={{
								id: session?.user.id || "",
								name: session?.user.name,
								image: session?.user.image,
							}}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
