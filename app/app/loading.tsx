import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<PageContainer>
			{/* Header */}
			<PageHeader
				title={<Skeleton className="h-7 w-48 md:h-9" />}
				description={<Skeleton className="h-5 w-72 md:h-6" />}
			/>

			<div className="flex flex-col gap-3">
				{/* Search and Create Group */}
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<Skeleton className="h-11 w-full md:h-12" />
					<Skeleton className="h-11 w-full md:w-[180px] md:h-12" />
				</div>

				{/* Recent Groups Section */}
				<section className="mt-3 md:mt-4">
					<div className="flex items-center justify-between mb-3">
						<Skeleton className="h-6 w-32 md:h-7" />
					</div>

					<div className="flex flex-col gap-2.5">
						{[...Array(3)].map((_, i) => (
							<Card key={i} className="p-4">
								<div className="flex items-start gap-4">
									{/* Image placeholder */}
									<Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />

									{/* Content */}
									<div className="flex-1 min-w-0 py-1">
										<Skeleton className="h-5 w-3/4 mb-2" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-4 w-2/3" />
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</section>
			</div>
		</PageContainer>
	);
}
