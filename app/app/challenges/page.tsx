import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ChallengesPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<PageContainer>
			<PageHeader
				title="Défis"
				description="Découvrez et relevez de nouveaux défis"
				userPromise={Promise.resolve(session?.user ?? null)}
			/>
			<div className="p-4 space-y-8">
				<div className="max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">
						Fonctionnalités à venir
					</h2>
					<div className="grid gap-4">
						<div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<h3 className="font-medium mb-2">Explorer les défis</h3>
							<ul className="grid gap-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Voir la liste complète des défis</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Filtrer par catégorie</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Voir le détail de chaque défi</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Suivre votre progression</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Voir les points à gagner</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
