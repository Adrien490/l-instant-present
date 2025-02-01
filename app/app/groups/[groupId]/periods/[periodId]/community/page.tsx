import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";

export default async function CommunityPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Communauté"
				description="Validez et encouragez les autres"
			/>
			<div className="p-4 space-y-8">
				<div className="max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">
						Fonctionnalités à venir
					</h2>
					<div className="grid gap-4">
						<div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<h3 className="font-medium mb-2">Validation collective</h3>
							<ul className="grid gap-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Voir les soumissions en attente de validation</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Voter et commenter les réalisations</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Suivre l&apos;activité des autres participants</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Interagir avec la communauté</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
