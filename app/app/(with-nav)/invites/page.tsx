import { getUserInvites } from "@/app/entities/group-invites/queries/get-user-invites";
import getGroups from "@/app/entities/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function InvitesPage() {
	const [invites, groups] = await Promise.all([
		getUserInvites(),
		getGroups({ search: "" }),
	]);

	return (
		<PageContainer className="pb-24">
			<PageHeader
				title="Invitations"
				description="Gérez les invitations que vous avez reçues pour rejoindre des groupes."
			/>

			{groups.length > 0 && (
				<div className="mt-4">
					<Button asChild>
						<Link href="/app/invites/send">
							<Plus className="h-4 w-4 mr-2" />
							Envoyer une invitation
						</Link>
					</Button>
				</div>
			)}

			<div className="mt-6 space-y-3">
				{invites.map((invite) => (
					<Link key={invite.id} href={`/app/invites/${invite.id}`}>
						<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
							<div className="flex items-center gap-4 p-4">
								<div className="rounded-xl bg-primary/10 p-3 shadow-sm">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium leading-none truncate text-foreground/80">
											{invite.group.name}
										</p>
									</div>
									<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground/90">
										<span className="flex items-center gap-1">
											<Users className="h-3.5 w-3.5" />
											{invite.group.members.length}
										</span>
										<span className="text-xs text-muted-foreground/70">
											Invité par {invite.sender.name}
											{formatDistanceToNow(new Date(invite.createdAt), {
												addSuffix: true,
												locale: fr,
											})}
										</span>
									</div>
								</div>
							</div>
						</Card>
					</Link>
				))}

				{invites.length === 0 && (
					<div className="mt-8 flex min-h-[60vh] flex-col items-center justify-center px-4">
						<div className="flex flex-col items-center gap-6 text-center">
							<div className="rounded-2xl bg-muted/60 p-5">
								<Mail className="h-8 w-8 text-muted-foreground/80" />
							</div>
							<div className="space-y-1.5">
								<p className="text-base/relaxed font-medium text-foreground/80">
									Aucune invitation
								</p>
								<p className="text-sm/relaxed text-muted-foreground max-w-[260px]">
									Vous n&apos;avez pas d&apos;invitation en attente pour le
									moment
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</PageContainer>
	);
}
