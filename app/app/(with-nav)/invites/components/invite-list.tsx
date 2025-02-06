"use client";

import { type GetGroupInviteListResponse } from "@/app/features/group-invites/queries/get-group-invite-list";
import EmptyState from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Mail, Send, Users } from "lucide-react";
import Link from "next/link";

interface InviteListProps {
	invites: GetGroupInviteListResponse;
	type: "sent" | "received";
	className?: string;
}

export default function InviteList({
	invites,
	type,
	className,
}: InviteListProps) {
	if (invites.length === 0) {
		return (
			<EmptyState
				className="mt-20"
				icon={
					type === "sent" ? (
						<Send className="h-8 w-8" />
					) : (
						<Mail className="h-8 w-8" />
					)
				}
				title={
					type === "sent"
						? "Aucune invitation envoyée"
						: "Aucune invitation reçue"
				}
				description={
					type === "sent"
						? "Vous n'avez pas encore envoyé d'invitation"
						: "Vous n'avez pas d'invitation en attente pour le moment"
				}
			/>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{invites.map((invite) => (
				<Link key={invite.id} href={`/app/invites/${invite.id}`}>
					<Card
						className={cn(
							"overflow-hidden transition-all",
							"hover:bg-muted/50 active:bg-muted",
							invite.status === "ACCEPTED" && "bg-success/5",
							invite.status === "REJECTED" && "bg-destructive/5"
						)}
					>
						<div className="flex items-start gap-4 p-4">
							<div
								className={cn(
									"rounded-xl p-3 shadow-sm",
									invite.status === "PENDING" && "bg-primary/10",
									invite.status === "ACCEPTED" && "bg-success/10",
									invite.status === "REJECTED" && "bg-destructive/10"
								)}
							>
								{type === "sent" ? (
									<Send
										className={cn(
											"h-5 w-5",
											invite.status === "PENDING" && "text-primary",
											invite.status === "ACCEPTED" && "text-success",
											invite.status === "REJECTED" && "text-destructive"
										)}
									/>
								) : (
									<Mail className="h-5 w-5 text-primary" />
								)}
							</div>
							<div className="flex-1 min-w-0 space-y-1">
								<div className="flex items-center justify-between gap-2">
									<p className="font-medium leading-none text-foreground/90">
										{invite.group.name}
									</p>
									<Badge
										variant={
											invite.status === "PENDING"
												? "outline"
												: invite.status === "ACCEPTED"
												? "secondary"
												: "destructive"
										}
										className="font-normal"
									>
										{invite.status}
									</Badge>
								</div>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground/90">
									<span className="flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5" />
										{invite.group.members.length} membres
									</span>
									<span className="flex items-center gap-1.5">
										<Calendar className="h-3.5 w-3.5" />
										{formatDistanceToNow(new Date(invite.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</span>
									{invite.expiresAt && (
										<span className="flex items-center gap-1.5">
											<Clock className="h-3.5 w-3.5" />
											Expire{" "}
											{formatDistanceToNow(new Date(invite.expiresAt), {
												addSuffix: true,
												locale: fr,
											})}
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground">
									{type === "sent" ? (
										<>
											Envoyée à{" "}
											<span className="font-medium text-foreground/80">
												{invite.email}
											</span>
										</>
									) : (
										<>
											Invité par{" "}
											<span className="font-medium text-foreground/80">
												{invite.sender.name}
											</span>
										</>
									)}
								</p>
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	);
}
