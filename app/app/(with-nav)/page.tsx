import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Medal, Plus, Target, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<div className="flex-1 pb-20">
			{/* Hero Section */}
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
				<div className="relative px-4 pt-6 pb-8">
					<h1 className="text-xl font-semibold">
						Bonjour {session?.user?.name?.split(" ")[0]} 👋
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Que souhaitez-vous faire aujourd&apos;hui ?
					</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="px-4">
				<div className="grid grid-cols-2 gap-3">
					<Link href="/app/my-groups/new">
						<Card className="flex h-32 flex-col items-center justify-center gap-2 p-4 transition-colors hover:bg-muted/50">
							<div className="rounded-full bg-primary/10 p-3">
								<Plus className="h-6 w-6 text-primary" />
							</div>
							<span className="text-sm font-medium">Créer un groupe</span>
						</Card>
					</Link>
					<Link href="/app/my-groups">
						<Card className="flex h-32 flex-col items-center justify-center gap-2 p-4 transition-colors hover:bg-muted/50">
							<div className="rounded-full bg-primary/10 p-3">
								<Users className="h-6 w-6 text-primary" />
							</div>
							<span className="text-sm font-medium">Mes groupes</span>
						</Card>
					</Link>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="mt-8 px-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Activité récente</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/app/my-groups">Voir tout</Link>
					</Button>
				</div>
				<div className="mt-4 space-y-3">
					<Card className="p-4">
						<div className="flex items-start gap-3">
							<div className="rounded-lg bg-primary/10 p-2">
								<Target className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 space-y-1">
								<p className="text-sm font-medium">Nouveau défi disponible</p>
								<p className="text-xs text-muted-foreground">
									Dans le groupe &quot;Les matinaux&quot;
								</p>
							</div>
							<p className="text-xs text-muted-foreground">Il y a 2h</p>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-start gap-3">
							<div className="rounded-lg bg-primary/10 p-2">
								<Medal className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 space-y-1">
								<p className="text-sm font-medium">Défi validé</p>
								<p className="text-xs text-muted-foreground">
									&quot;Méditation matinale&quot; complété
								</p>
							</div>
							<p className="text-xs text-muted-foreground">Hier</p>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
