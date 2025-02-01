"use client";

import { GetGroupsResponse } from "@/app/entities/groups/queries/get-groups";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, UserPlus, Users } from "lucide-react";
import Link from "next/link";

type Props = {
	groups: GetGroupsResponse;
};

export default function GroupList({ groups }: Props) {
	if (!groups?.length) {
		return (
			<Card className="flex flex-col items-center text-center p-6 gap-6">
				<div className="rounded-full bg-primary/10 p-3">
					<UserPlus className="h-6 w-6 text-primary" />
				</div>
				<div className="space-y-2">
					<h3 className="text-sm font-medium">
						Vous n&apos;avez pas encore de groupe
					</h3>
					<p className="text-xs text-muted-foreground px-4">
						Créez votre premier groupe ou attendez une invitation
					</p>
				</div>
				<Button size="sm" className="w-full" asChild>
					<Link href="/app/my-groups/new">
						<Plus className="h-4 w-4 mr-1.5" />
						Créer un groupe
					</Link>
				</Button>
			</Card>
		);
	}

	return (
		<div className="mt-4 flex flex-col gap-2">
			{groups.map((group) => (
				<Link key={group.id} href={`/app/groups/${group.id}`}>
					<Card className="p-4 transition-colors hover:bg-muted/50">
						<div className="flex items-center gap-4">
							<div className="rounded-lg bg-primary/10 p-2">
								<Users className="h-4 w-4 text-primary" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium truncate">{group.name}</p>
								<p className="text-xs text-muted-foreground">
									{group.members.length} membres
								</p>
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	);
}
