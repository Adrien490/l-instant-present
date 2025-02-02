"use client";

import { GetGroupInviteResponse } from "@/app/entities/group-invites/queries/get-group-invite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Check, Clock, Mail, Send, Users, X } from "lucide-react";

type Props = {
	invite: NonNullable<GetGroupInviteResponse>;
	className?: string;
};

export default function GroupInviteItem({ invite, className }: Props) {
	const isSender = invite.senderId === invite.sender.id;

	return (
		<Card className={cn("overflow-hidden", className)}>
			{/* En-tête */}
			<div className="border-b p-4">
				<div className="flex items-start gap-4">
					<div
						className={cn(
							"rounded-xl p-3 shadow-sm",
							invite.status === "PENDING" && "bg-primary/10",
							invite.status === "ACCEPTED" && "bg-success/10",
							invite.status === "REJECTED" && "bg-destructive/10"
						)}
					>
						{isSender ? (
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
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-2">
							<h2 className="text-lg font-semibold">{invite.group.name}</h2>
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
						<p className="mt-1 text-sm text-muted-foreground line-clamp-2">
							{invite.group.description}
						</p>
					</div>
				</div>
			</div>

			{/* Informations */}
			<div className="p-4 space-y-4">
				{/* Expéditeur/Destinataire */}
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={invite.sender.image || undefined} />
						<AvatarFallback>
							{invite.sender.name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm text-muted-foreground">
							{isSender ? "Envoyée à" : "Invité par"}
						</p>
						<p className="font-medium truncate">
							{isSender ? invite.email : invite.sender.name}
						</p>
					</div>
				</div>

				{/* Métadonnées */}
				<div className="bg-muted/50 rounded-lg p-4 space-y-3">
					<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<Users className="h-4 w-4" />
						<span>{invite.group.members.length} membres</span>
					</div>
					<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>
							{formatDistanceToNow(new Date(invite.createdAt), {
								addSuffix: true,
								locale: fr,
							})}
						</span>
					</div>
					{invite.expiresAt && (
						<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span>
								Expire{" "}
								{formatDistanceToNow(new Date(invite.expiresAt), {
									addSuffix: true,
									locale: fr,
								})}
							</span>
						</div>
					)}
				</div>

				{/* Actions */}
				{invite.status === "PENDING" && (
					<div className="grid grid-cols-2 gap-4">
						{!isSender ? (
							<>
								<Button className="w-full gap-2">
									<Check className="h-4 w-4" />
									Accepter
								</Button>
								<Button variant="destructive" className="w-full gap-2">
									<X className="h-4 w-4" />
									Refuser
								</Button>
							</>
						) : (
							<Button variant="destructive" className="w-full gap-2">
								<X className="h-4 w-4" />
								Annuler
							</Button>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}
