"use client";

import { GetGroupsResponse } from "@/app/entities/groups/queries/get-groups";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, Users } from "lucide-react";
import Link from "next/link";

type Props = {
	groups: GetGroupsResponse;
	userId?: string;
};

export default function GroupList({ groups, userId }: Props) {
	console.log(groups);
	if (!groups?.length) {
		return (
			<div className="mt-6 flex min-h-[60vh] flex-col items-center justify-center px-4">
				<div className="flex flex-col items-center gap-6 text-center">
					<div className="rounded-2xl bg-muted/60 p-5">
						<Users className="h-8 w-8 text-muted-foreground/80" />
					</div>
					<div className="space-y-1.5">
						<p className="text-base/relaxed font-medium text-foreground/80">
							Aucun groupe trouvé
						</p>
						<p className="text-sm/relaxed text-muted-foreground max-w-[260px]">
							Aucun groupe ne correspond à votre recherche
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-4 flex flex-col gap-2.5">
			{groups.map((group) => (
				<Link key={group.id} href={`/app/groups/${group.id}`}>
					<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
						<div className="flex items-center gap-4 p-4">
							<div className="rounded-xl bg-primary/10 p-3 shadow-sm">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="font-medium leading-none truncate text-foreground/80">
										{group.name}
									</p>
									{group.ownerId === userId && (
										<Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
									)}
								</div>
								<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground/90">
									<span className="flex items-center gap-1">
										<Users className="h-3.5 w-3.5" />
										{group.members.length}
									</span>
									<span className="text-xs text-muted-foreground/70">
										Créé{" "}
										{formatDistanceToNow(new Date(group.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</span>
								</div>
								{group.description && (
									<p className="mt-2 text-sm text-muted-foreground/80 line-clamp-1">
										{group.description}
									</p>
								)}
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	);
}
