import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewGroupLoading() {
	return (
		<PageContainer className="pb-20">
			<div className="mb-8">
				<Link
					href="/app/my-groups"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Retour aux groupes
				</Link>
			</div>

			<PageHeader
				title={<Skeleton className="h-8 w-64" />}
				description={<Skeleton className="h-5 w-full max-w-[500px]" />}
			/>

			<Card className="mt-8 p-6">
				<div className="space-y-8">
					{/* Nom */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-32 w-full" />
					</div>

					{/* Image */}
					<div className="space-y-2">
						<Skeleton className="h-5 w-28" />
						<div className="flex items-center gap-4">
							<Skeleton className="h-24 w-24 rounded-lg" />
							<Skeleton className="h-9 w-32" />
						</div>
					</div>

					{/* Boutons */}
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
			</Card>
		</PageContainer>
	);
}
