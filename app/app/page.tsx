import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<PageContainer>
			<PageHeader
				title="L'instant présent"
				description="Créez des souvenirs uniques"
				userPromise={Promise.resolve(session?.user ?? null)}
			/>
			<div className="p-4 space-y-8">
				<div className="max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">
						Fonctionnalités à venir
					</h2>
					<div className="grid gap-4">
						<div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<h3 className="font-medium mb-2">Votre tableau de bord</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Bientôt disponible ! Voici ce que vous pourrez retrouver sur
								votre page d&apos;accueil :
							</p>
							<ul className="grid gap-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Un résumé de vos défis en cours</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Vos dernières validations reçues</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Vos statistiques personnelles</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Le feed d&apos;activité de la communauté</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
