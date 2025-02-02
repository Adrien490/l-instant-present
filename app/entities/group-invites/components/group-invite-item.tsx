"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Crown, Mail, Shield, Users, X } from "lucide-react";
import { useState } from "react";
import { GetGroupInviteResponse } from "../queries/get-group-invite";
import { InviteStatus } from "../schemas/group-invite-schema";

type Props = {
	invite: NonNullable<GetGroupInviteResponse>;
};

export default function GroupInviteItem({ invite }: Props) {
	const [open, setOpen] = useState(false);

	const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
	const isPending = invite.status === InviteStatus.PENDING;

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
					<div className="flex gap-3 p-3.5">
						<div className="flex-shrink-0 mt-0.5">
							<div className="rounded-lg bg-primary/10 p-2.5 shadow-sm">
								<Mail className="h-4 w-4 text-primary" />
							</div>
						</div>
						<div className="flex-1 min-w-0 space-y-2">
							<div className="space-y-1">
								<div className="flex items-center gap-2 flex-wrap">
									<p className="font-medium text-sm truncate text-foreground/90">
										{invite.group.name}
									</p>
									{isExpired ? (
										<span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
											Expirée
										</span>
									) : (
										<>
											{invite.status === "PENDING" && (
												<span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
													En attente
												</span>
											)}
											{invite.status === "ACCEPTED" && (
												<span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
													Acceptée
												</span>
											)}
											{invite.status === "REJECTED" && (
												<span className="text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
													Refusée
												</span>
											)}
										</>
									)}
								</div>
								{invite.group.description && (
									<p className="text-xs text-muted-foreground/80 line-clamp-1">
										{invite.group.description}
									</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<div className="flex items-center gap-2">
									<Users className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										{invite.group.members.length} membre
										{invite.group.members.length > 1 ? "s" : ""}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground truncate">
										{invite.email}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<time className="text-[10px] text-muted-foreground/70">
										Envoyée{" "}
										{formatDistanceToNow(new Date(invite.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
									{invite.expiresAt && (
										<span className="text-[10px] text-muted-foreground/70">
											· Expire{" "}
											{formatDistanceToNow(new Date(invite.expiresAt), {
												addSuffix: true,
												locale: fr,
											})}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</Card>
			</DrawerTrigger>

			<DrawerContent className="h-[90vh] flex flex-col p-0 pb-[calc(72px+max(env(safe-area-inset-bottom),16px))]">
				<DrawerHeader className="flex-shrink-0 text-left p-6 pb-4 border-b">
					<div className="flex items-start gap-4">
						<div className="rounded-xl bg-primary/10 p-3">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<DrawerTitle className="text-xl font-semibold">
									{invite.group.name}
								</DrawerTitle>
								{isExpired && (
									<span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
										Expirée
									</span>
								)}
							</div>
							{invite.group.description && (
								<DrawerDescription className="mt-2 text-sm line-clamp-2">
									{invite.group.description}
								</DrawerDescription>
							)}
						</div>
					</div>
				</DrawerHeader>

				<ScrollArea className="flex-1">
					<div className="p-6 space-y-6">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-primary/10 p-2">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-muted-foreground">
										Invitation envoyée à
									</p>
									<p className="font-medium truncate">{invite.email}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-primary/10 p-2">
									<Shield className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-muted-foreground">Statut</p>
									<p className="font-medium">
										{isPending && "En attente"}
										{invite.status === "ACCEPTED" && "Acceptée"}
										{invite.status === "REJECTED" && "Refusée"}
									</p>
								</div>
								{invite.expiresAt && (
									<time className="text-xs px-2 py-0.5 rounded-full bg-muted">
										Expire{" "}
										{formatDistanceToNow(new Date(invite.expiresAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
								)}
							</div>
						</div>

						<div className="bg-muted/50 rounded-xl p-4">
							<div className="flex flex-col space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5 text-primary" />
										{invite.group.members.length} membre
										{invite.group.members.length > 1 ? "s" : ""}
									</h3>
									<time className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
										Invitation envoyée{" "}
										{formatDistanceToNow(new Date(invite.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
								</div>

								{invite.group.members.length > 0 && (
									<div className="space-y-3">
										<div className="flex -space-x-2 overflow-hidden">
											{invite.group.members.slice(0, 8).map((member) => (
												<div
													key={member.userId}
													className="relative group inline-block"
												>
													<div
														className="h-8 w-8 rounded-full ring-2 ring-background transition-transform hover:scale-105"
														style={{
															backgroundImage: `url(${member.user.image})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
														}}
													/>
													<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm border">
														{member.user.name}
														{member.role === "ADMIN" && (
															<Crown className="inline-block ml-1 h-3 w-3 text-amber-500" />
														)}
													</div>
												</div>
											))}
											{invite.group.members.length > 8 && (
												<div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background">
													<span className="text-[10px] font-medium">
														+{invite.group.members.length - 8}
													</span>
												</div>
											)}
										</div>
										<div className="text-[10px] text-muted-foreground/70 line-clamp-1">
											<span className="font-medium">Membres : </span>
											{invite.group.members.map((m) => m.user.name).join(", ")}
										</div>
									</div>
								)}
							</div>
						</div>

						{isPending && !isExpired && (
							<div className="space-y-3 pb-safe">
								<Button size="lg" className="w-full justify-start font-medium">
									<Check className="mr-3 h-4 w-4" />
									Accepter l&apos;invitation
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="w-full justify-start font-medium"
								>
									<X className="mr-3 h-4 w-4" />
									Refuser l&apos;invitation
								</Button>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
