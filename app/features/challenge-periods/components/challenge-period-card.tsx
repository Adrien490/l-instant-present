"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ChevronRight, Target, Trophy } from "lucide-react";
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
	const challengeCount = period._count?.challenges || 0;

	return (
		<Card
			className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4"
			style={{
				borderLeftColor: isActive
					? "hsl(var(--primary))"
					: isPast
					? "hsl(var(--muted))"
					: "hsl(var(--secondary))",
			}}
		>
			<Link
				href={`/app/groups/${groupId}/challenge-periods/${period.id}/challenges`}
				className="block w-full"
			>
				<div className="relative flex items-start p-3 md:p-6 w-full">
					<div className="relative flex-shrink-0">
						<div
							className={cn(
								"w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center transform transition-transform group-hover:rotate-12",
								"bg-gradient-to-br shadow-lg",
								isActive && "from-primary to-primary/60",
								isPast && "from-muted to-muted/60",
								isFuture && "from-secondary to-secondary/60"
							)}
						>
							<Trophy
								className={cn(
									"h-6 w-6 md:h-8 md:w-8 transition-colors",
									"text-background"
								)}
							/>
						</div>
					</div>

					<div className="flex-1 min-w-0 ml-3 md:ml-6">
						<div className="flex items-center justify-between gap-2 mb-2 md:mb-3">
							<h3 className="text-base md:text-xl font-semibold tracking-tight text-foreground truncate">
								{period.name}
							</h3>
							<ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 transform transition-transform group-hover:translate-x-1" />
						</div>

						<div className="space-y-2 md:space-y-3">
							<div className="flex items-center text-xs md:text-sm">
								<Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 mr-1.5 md:mr-2 text-muted-foreground" />
								<span className="text-muted-foreground font-medium truncate">
									{format(new Date(period.startDate), "d MMM yyyy", {
										locale: fr,
									})}
									{" - "}
									{format(new Date(period.endDate), "d MMM yyyy", {
										locale: fr,
									})}
								</span>
							</div>

							<div className="flex items-center gap-4 md:gap-6">
								<div className="flex items-center text-xs md:text-sm">
									<Target className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-muted-foreground" />
									<span className="font-medium">{challengeCount} défis</span>
								</div>
							</div>

							<div>
								<span
									className={cn(
										"text-xs font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full",
										isActive && "bg-primary/15 text-primary",
										isPast && "bg-muted-foreground/15 text-muted-foreground",
										isFuture && "bg-secondary/15 text-secondary"
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
