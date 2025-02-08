// group-invite-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GetGroupInviteListResponse } from "../queries/get-group-invite-list";

type GroupInviteData = GetGroupInviteListResponse["items"][number];

interface Props {
	invite: GroupInviteData;
	isSent: boolean;
}

export default function GroupInviteCard({ invite, isSent }: Props) {
	const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();

	return (
		<Card className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-background via-background to-background/80 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
			<Link href={`/app/invites/${invite.id}`} className="block w-full">
				<div className="relative flex items-center p-4 md:p-5 w-full gap-4 md:gap-6">
					{/* Image du groupe */}
					<div className="relative flex-shrink-0">
						<div className="relative w-[72px] h-[72px] md:w-24 md:h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
							{invite.group.imageUrl ? (
								<Image
									src={invite.group.imageUrl}
									alt={invite.group.name}
									fill
									className="object-cover rounded-2xl"
									sizes="(max-width: 768px) 72px, 96px"
									loading="lazy"
									quality={90}
								/>
							) : (
								<div className="absolute inset-[3px] rounded-xl overflow-hidden">
									<div className="grid grid-cols-2 gap-[2px]">
										{invite.group.members.slice(0, 4).map((member) => (
											<div
												key={member.userId}
												className="relative aspect-square bg-cover bg-center"
												style={{
													backgroundImage: `url(${member.user.image})`,
												}}
											/>
										))}
									</div>
								</div>
							)}
							{/* Badge de statut */}
							<div className="absolute -top-1 -right-1 rounded-full bg-background/95 p-1.5 shadow-lg backdrop-blur-sm">
								<Mail
									className={cn(
										"h-4 w-4",
										isSent ? "text-muted-foreground" : "text-primary"
									)}
								/>
							</div>
						</div>
					</div>

					{/* Contenu */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-4">
							<h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors duration-200">
								{invite.group.name}
							</h3>
							<ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
						</div>

						<div className="mt-2 md:mt-3 space-y-3">
							{/* Status Badge */}
							<div className="flex items-center gap-2">
								{isExpired ? (
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
										Expirée
									</span>
								) : (
									<>
										{invite.status === "PENDING" && (
											<span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
												En attente
											</span>
										)}
										{invite.status === "ACCEPTED" && (
											<span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
												Acceptée
											</span>
										)}
										{invite.status === "REJECTED" && (
											<span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
												Refusée
											</span>
										)}
									</>
								)}
							</div>

							{/* Membres */}
							<div className="flex items-center">
								<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
									<Users className="h-4 w-4" />
									<span className="text-sm font-medium">
										{invite.group.members.length} membre
										{invite.group.members.length > 1 ? "s" : ""}
									</span>
								</span>
							</div>

							{/* Info supplémentaire */}
							<p className="text-sm text-muted-foreground/70">
								{isSent ? (
									<>Envoyée à {invite.email}</>
								) : (
									<>Invitation par {invite.sender.name}</>
								)}{" "}
								•{" "}
								{formatDistanceToNow(new Date(invite.createdAt), {
									addSuffix: true,
									locale: fr,
								})}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</Card>
	);
}
