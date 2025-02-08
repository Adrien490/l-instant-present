import UserAvatar from "@/app/features/users/components/user-avatar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { Suspense } from "react";
import BackButton from "./back-button";

type Props = {
	title: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	showBackButton?: boolean;
};

export default async function PageHeader({
	title,
	description,
	className,
	showBackButton = false,
}: Props) {
	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full",
				"bg-gradient-to-b from-background via-background/95 to-background/90",
				"backdrop-blur supports-[backdrop-filter]:bg-background/60",
				"border-b border-border/40",
				"transition-all duration-200 ease-in-out",
				className
			)}
		>
			{/* Container principal */}
			<div className="py-2.5 mx-auto">
				<div className="flex items-center justify-between gap-4 h-14">
					{/* Section gauche avec bouton retour et titre */}
					<div className="flex flex-1 items-center min-w-0 gap-3">
						{showBackButton && <BackButton />}

						{/* Titre et description */}
						<div className="min-w-0 flex-1">
							<div className="flex flex-col">
								<h1
									className={cn(
										"text-base font-semibold leading-tight tracking-tight",
										"truncate md:text-xl",
										"bg-clip-text text-transparent bg-gradient-to-r",
										"from-foreground to-foreground/80"
									)}
								>
									{title}
								</h1>
								{description && (
									<div className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
										{description}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Section droite avec actions */}

					<div className="flex items-center gap-2">
						<Suspense fallback={<></>}>
							<UserAvatar
								userPromise={auth.api
									.getSession({
										headers: await headers(),
									})
									.then((session) => session?.user)}
							/>
						</Suspense>
					</div>
				</div>
			</div>

			{/* Barre de progression */}
			<div className="h-0.5 bg-primary/20 w-full origin-left" />
		</header>
	);
}
