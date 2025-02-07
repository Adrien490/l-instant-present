"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { GetChallengePeriodListResponse } from "../queries/get-challenge-period-list";

type ChallengePeriodData = GetChallengePeriodListResponse[number];

type Props = {
	period: ChallengePeriodData;
	groupId: string;
};

export default function ChallengePeriodCard({ period, groupId }: Props) {
	const isActive =
		new Date(period.startDate) <= new Date() &&
		new Date() <= new Date(period.endDate);
	const isPast = new Date(period.endDate) < new Date();
	const isFuture = new Date(period.startDate) > new Date();

	return (
		<Card className="overflow-hidden">
			<Link
				href={`/app/groups/${groupId}/challenge-periods/${period.id}/challenges`}
				className="block w-full"
			>
				<div className="relative flex items-start p-4 w-full">
					{/* Status indicator */}
					<div className="relative flex-shrink-0 mt-1">
						<div
							className={cn(
								"w-16 h-16 rounded-xl flex items-center justify-center",
								"bg-gradient-to-br shadow-sm",
								isActive && "from-primary/20 to-primary/10",
								isPast && "from-muted/20 to-muted/10",
								isFuture && "from-secondary/20 to-secondary/10"
							)}
						>
							<Trophy
								className={cn(
									"h-6 w-6",
									isActive && "text-primary",
									isPast && "text-muted-foreground",
									isFuture && "text-secondary-foreground"
								)}
							/>
						</div>
					</div>

					{/* Content Section */}
					<div className="flex-1 min-w-0 ml-4 py-1">
						<div className="flex items-center justify-between gap-2">
							<h3 className="text-base font-medium leading-tight tracking-tight md:tracking-normal truncate text-foreground antialiased">
								{period.name}
							</h3>
							<ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
						</div>

						<div className="mt-2 flex flex-col gap-1.5">
							<div className="flex items-center">
								<span className="text-sm leading-normal antialiased text-muted-foreground flex items-center gap-1.5">
									<Calendar className="h-4 w-4 flex-shrink-0" />
									{format(new Date(period.startDate), "d MMM yyyy", {
										locale: fr,
									})}
									{" - "}
									{format(new Date(period.endDate), "d MMM yyyy", {
										locale: fr,
									})}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<span
									className={cn(
										"text-xs font-medium px-2 py-0.5 rounded-full",
										isActive && "bg-primary/10 text-primary",
										isPast && "bg-muted/10 text-muted-foreground",
										isFuture && "bg-secondary/10 text-secondary-foreground"
									)}
								>
									{isActive && "En cours"}
									{isPast && "Terminée"}
									{isFuture && "À venir"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</Card>
	);
}
