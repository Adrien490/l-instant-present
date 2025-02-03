import GroupInviteList from "@/app/entities/group-invites/components/group-invite-list";
import getGroupInvites from "@/app/entities/group-invites/queries/get-group-invites";
import EmptyState from "@/components/empty-state";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Plus, Send } from "lucide-react";
import Link from "next/link";

type Props = {
	searchParams: Promise<{ type?: "received" | "sent" }>;
};

export default async function InvitesPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const type = resolvedSearchParams.type || "received";
	const invites = await getGroupInvites({ type });

	return (
		<PageContainer className="pb-24">
			<div className="flex flex-col gap-6">
				<PageHeader
					title="Invitations"
					description="Gérez vos invitations aux groupes"
				/>

				<Button asChild size="lg" className="w-full">
					<Link
						href="/app/invites/send"
						className="flex items-center justify-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Envoyer une invitation
					</Link>
				</Button>

				<div className="bg-muted rounded-xl p-1.5">
					<div className="grid grid-cols-2 gap-1.5">
						<Link
							href="/app/invites?type=received"
							className={cn(
								"flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
								"hover:bg-background/80 active:bg-background",
								type === "received"
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground"
							)}
						>
							<Mail className="h-4 w-4" />
							Reçues
						</Link>
						<Link
							href="/app/invites?type=sent"
							className={cn(
								"flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
								"hover:bg-background/80 active:bg-background",
								type === "sent"
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground"
							)}
						>
							<Send className="h-4 w-4" />
							Envoyées
						</Link>
					</div>
				</div>

				{invites.length === 0 ? (
					<EmptyState
						title="Aucune invitation trouvée"
						description="Vous n'avez aucune invitation"
						icon={<Mail className="h-8 w-8 text-muted-foreground/80" />}
					/>
				) : (
					<GroupInviteList
						className="flex flex-col gap-4"
						invites={invites}
						type={type}
					/>
				)}
			</div>
		</PageContainer>
	);
}
