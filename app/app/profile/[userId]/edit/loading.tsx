import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfileEditPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Modifier mon profil"
				description="Modifier les informations de votre profil"
			/>

			<div className="flex flex-col gap-4 w-full">
				<div className="space-y-6">
					{/* Section upload d'avatar */}
					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div className="space-y-1">
								<FormLabel className="text-base font-medium">
									Photo de profil
								</FormLabel>
								<p className="text-sm text-muted-foreground">
									Format recommandé : 400×400px ou plus grand
								</p>
							</div>
						</div>

						<div className="relative rounded-lg overflow-hidden shadow-sm">
							<div className="relative aspect-square w-32 bg-muted mx-auto">
								<Skeleton className="h-full w-full" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<FormLabel className="text-base">
								Nom <span className="text-destructive">*</span>
							</FormLabel>
							<Skeleton className="h-11 w-full" />
						</div>

						<div className="space-y-2">
							<FormLabel className="text-base">
								Email <span className="text-destructive">*</span>
							</FormLabel>
							<Skeleton className="h-11 w-full" />
						</div>
					</div>

					<div className="space-y-3 pt-2">
						<Button type="submit" className="w-full h-11 text-base" disabled>
							Enregistrer
						</Button>
						<p className="text-xs text-muted-foreground text-center">
							Les champs marqués d&apos;un{" "}
							<span className="text-destructive">*</span> sont obligatoires
						</p>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
