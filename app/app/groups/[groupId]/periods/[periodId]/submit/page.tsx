import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SubmitPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<PageContainer>
			<PageHeader
				title="Soumettre"
				description="Partagez votre réussite"
				userPromise={Promise.resolve(session?.user ?? null)}
			/>
			<div className="p-4 space-y-8">
				<div className="max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">
						Fonctionnalités à venir
					</h2>
					<div className="grid gap-4">
						<div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<h3 className="font-medium mb-2">Soumission de défis</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Bientôt disponible ! Voici comment vous pourrez soumettre vos
								réalisations :
							</p>
							<ul className="grid gap-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Sélectionner le défi réalisé</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Télécharger une photo ou vidéo</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Ajouter une description</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Prévisualiser votre soumission</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Envoyer pour validation</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
