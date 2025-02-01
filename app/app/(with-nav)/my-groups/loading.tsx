import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import Link from "next/link";

export default function Loading() {
	return (
		<PageContainer className="pb-20">
			<PageHeader
				title={<Skeleton className="h-7 w-48" />}
				description={<Skeleton className="h-5 w-full max-w-[500px]" />}
			/>

			<div className="flex items-center gap-2 mt-4">
				<div className="flex-1">
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="shrink-0">
					<Link href="/app/my-groups/new">
						<Button>Créer un groupe</Button>
					</Link>
				</div>
			</div>

			<div className="mt-6 space-y-3">
				{[...Array(6)].map((_, i) => (
					<Card key={i} className="p-4">
						<div className="flex items-center gap-4">
							<div className="rounded-xl bg-primary/10 p-3">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3.5 w-3.5 rounded-full" />
								</div>
								<div className="flex items-center gap-3">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-3 w-24" />
								</div>
								<Skeleton className="h-3 w-3/4" />
							</div>
						</div>
					</Card>
				))}
			</div>
		</PageContainer>
	);
}
