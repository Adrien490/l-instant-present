"use client";

import EmptyPlaceholder from "@/components/empty-placeholder";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { use } from "react";
import { GetChallengePeriodListResponse } from "../queries/get-challenge-period-list";
import ChallengePeriodCard from "./challenge-period-card";

type Props = {
	getChallengePeriodListPromise: Promise<GetChallengePeriodListResponse>;
	groupId: string;
	className?: string;
};

export default function ChallengePeriodList({
	getChallengePeriodListPromise,
	groupId,
	className,
}: Props) {
	const periods = use(getChallengePeriodListPromise);

	if (periods.length === 0) {
		return (
			<EmptyPlaceholder
				title="Aucune période trouvée"
				description="Commencez par créer une période pour organiser vos challenges"
				icon={<Calendar className="h-5 w-5 text-muted-foreground/80" />}
			/>
		);
	}

	return (
		<div className={cn("flex flex-col gap-2.5", className)}>
			{periods.map((period) => (
				<ChallengePeriodCard
					key={period.id}
					period={period}
					groupId={groupId}
				/>
			))}
		</div>
	);
}
