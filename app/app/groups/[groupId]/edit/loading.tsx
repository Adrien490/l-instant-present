import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<PageContainer>
			<PageHeader
				title={<Skeleton className="h-7 w-48 md:h-9" />}
				description={<Skeleton className="h-5 w-72 md:h-6" />}
			/>

			<div className="flex flex-col gap-4 w-full">
				<div className="space-y-6">
					{/* Section upload d'image */}
					<div className="space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<FormLabel className="text-base font-medium">
								Image du groupe
							</FormLabel>
						</div>

						<div className="relative rounded-lg overflow-hidden shadow-sm">
							<div className="relative aspect-video">
								<Skeleton className="absolute inset-0" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{/* Nom */}
						<div className="space-y-2">
							<FormLabel className="text-base">
								Nom <span className="text-destructive">*</span>
							</FormLabel>
							<Skeleton className="h-11 w-full" />
						</div>

						{/* Description */}
						<div className="space-y-2">
							<FormLabel className="text-base">Description</FormLabel>
							<Skeleton className="h-[104px] w-full" />{" "}
							{/* 4 rows * 26px line-height */}
						</div>
					</div>

					<div className="space-y-3 pt-2">
						<Skeleton className="h-11 w-full" />
						<div className="text-center">
							<Skeleton className="h-4 w-72 mx-auto" />
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
