import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";

export default async function LeaderboardPage() {
	return (
		<PageContainer>
			<PageHeader title="Classement" description="Suivez votre progression" />
			<div className="p-4 space-y-8">
				<div className="max-w-2xl">
					<h2 className="text-xl font-semibold mb-4">
						Fonctionnalités à venir
					</h2>
					<div className="grid gap-4">
						<div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<h3 className="font-medium mb-2">Tableau des scores</h3>
							<ul className="grid gap-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Le classement général</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Les points accumulés par chacun</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Le nombre de défis complétés</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Les badges et récompenses</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-primary" />
									<span>Les statistiques détaillées</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
