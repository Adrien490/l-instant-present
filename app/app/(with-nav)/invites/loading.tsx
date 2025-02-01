import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";

export default function Loading() {
	return (
		<PageContainer className="pb-24">
			<PageHeader
				title={<Skeleton className="h-7 w-48" />}
				description={<Skeleton className="h-5 w-full max-w-[500px]" />}
			/>

			<div className="mt-6 space-y-3">
				{[...Array(4)].map((_, i) => (
					<Card key={i} className="p-4">
						<div className="flex items-center gap-4">
							<div className="rounded-xl bg-primary/10 p-3">
								<Mail className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-40" />
								</div>
								<div className="flex items-center gap-3">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-3 w-32" />
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</PageContainer>
	);
}
