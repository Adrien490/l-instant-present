"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Users } from "lucide-react";
import Link from "next/link";
import { GetGroupInvitesResponse } from "../queries/get-group-invites";

type Props = {
	invites: GetGroupInvitesResponse;
	type: "sent" | "received";
	className?: string;
};

export default function GroupInviteList({ invites, type, className }: Props) {
	return (
		<div className={cn("", className)}>
			{invites.map((invite) => {
				const isExpired =
					invite.expiresAt && new Date(invite.expiresAt) < new Date();
				const isSent = type === "sent";
				return (
					<Link href={`/app/invites/${invite.id}`} key={invite.id}>
						<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted relative">
							<div className="flex gap-4 p-4">
								<div className="relative flex-shrink-0">
									<div className="relative w-14 h-14">
										<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
										<div className="absolute inset-[3px]">
											{invite.group.imageUrl ? (
												<div
													className="h-full w-full rounded-lg"
													style={{
														backgroundImage: `url(${invite.group.imageUrl})`,
														backgroundSize: "cover",
														backgroundPosition: "center",
													}}
												/>
											) : (
												<div className="flex -space-x-2 overflow-hidden">
													{invite.group.members.slice(0, 4).map((member) => (
														<div
															key={member.userId}
															className="relative h-full w-full"
														>
															<div
																className="h-6 w-6 rounded-full ring-2 ring-background"
																style={{
																	backgroundImage: `url(${member.user.image})`,
																	backgroundSize: "cover",
																	backgroundPosition: "center",
																}}
															/>
														</div>
													))}
													{invite.group.members.length > 4 && (
														<div className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-2 ring-background">
															<span className="text-[10px] font-medium">
																+{invite.group.members.length - 4}
															</span>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="flex-1 min-w-0">
									<div className="spacing-small">
										<div className="flex items-center gap-2 flex-wrap">
											<p className="font-medium text-base truncate text-foreground/90">
												{invite.group.name}
											</p>
											{isExpired ? (
												<span className="text-sm leading-none px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
													Expirée
												</span>
											) : (
												<>
													{invite.status === "PENDING" && (
														<span className="text-sm leading-none px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
															En attente
														</span>
													)}
													{invite.status === "ACCEPTED" && (
														<span className="text-sm leading-none px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
															Acceptée
														</span>
													)}
													{invite.status === "REJECTED" && (
														<span className="text-sm leading-none px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
															Refusée
														</span>
													)}
												</>
											)}
										</div>
										{invite.group.description && (
											<p className="text-sm text-muted-foreground/80 line-clamp-2">
												{invite.group.description}
											</p>
										)}
									</div>

									<div className="flex flex-col gap-1.5 mt-2">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{invite.group.members.length} membre
												{invite.group.members.length > 1 ? "s" : ""}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground/70">
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
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="absolute top-4 right-4 rounded-full bg-background p-1.5 shadow-sm">
								<Mail
									className={`h-4 w-4 ${
										isSent ? "text-muted-foreground" : "text-primary"
									}`}
								/>
							</div>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}
