"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupListSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<Card key={i} className="overflow-hidden">
					<div className="relative flex items-start p-4 w-full">
						{/* Image Skeleton */}
						<div className="relative flex-shrink-0 mt-1">
							<Skeleton className="w-16 h-16 rounded-lg" />
						</div>

						{/* Content Skeleton */}
						<div className="flex-1 min-w-0 ml-4 py-1">
							<Skeleton className="h-6 w-3/4" />

							<div className="mt-2 flex flex-col gap-1.5">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
