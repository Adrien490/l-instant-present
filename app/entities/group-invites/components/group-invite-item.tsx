"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupInviteStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Crown, Mail, Shield, Users, X } from "lucide-react";
import { useState } from "react";
import { useUpdateGroupInviteStatus } from "../hooks/use-update-group-invite-status";
import { GetGroupInviteResponse } from "../queries/get-group-invite";

type Props = {
	invite: NonNullable<GetGroupInviteResponse>;
};

export default function GroupInviteItem({ invite }: Props) {
	const [open, setOpen] = useState(false);

	const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
	const isPending = invite.status === GroupInviteStatus.PENDING;

	const { state, dispatch } = useUpdateGroupInviteStatus();

	console.log(state);

	console.log(invite);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
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
								<div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1.5 shadow-sm">
									<Mail className="h-4 w-4 text-primary" />
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
										Invitation par {invite.sender.name} •{" "}
										{formatDistanceToNow(new Date(invite.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</DrawerTrigger>

			<DrawerContent className="h-[94vh] flex flex-col px-0 pb-32">
				<ScrollArea className="flex-1">
					<div className="relative flex-shrink-0">
						<div className="relative w-full aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/10">
							<div className="absolute inset-0 flex items-center justify-center">
								{invite.group.imageUrl ? (
									<div
										className="absolute inset-0"
										style={{
											backgroundImage: `url(${invite.group.imageUrl})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
											opacity: 0.6,
										}}
									/>
								) : (
									<div className="grid grid-cols-4 gap-3">
										{invite.group.members.map((member) => (
											<div
												key={member.userId}
												className="relative group aspect-square"
											>
												<Avatar className="h-10 w-10">
													<AvatarImage
														src={member.user.image ?? undefined}
														alt={member.user.name}
													/>
													<AvatarFallback className="text-xs">
														{member.user.name
															?.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm border">
													{member.user.name}
													{member.role === "ADMIN" && (
														<Crown className="inline-block ml-1 h-2.5 w-2.5 text-amber-500" />
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
							<div className="absolute bottom-4 right-4 rounded-full bg-background p-2 shadow-sm">
								<Mail className="h-6 w-6 text-primary" />
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
						</div>

						<div className="absolute bottom-0 left-0 right-0 p-6">
							<div className="flex flex-col gap-4">
								<div>
									<DrawerTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
										{invite.group.name}
									</DrawerTitle>
									<p className="text-sm text-white/90 mt-1">
										Invitation envoyée par {invite.sender.name}
									</p>
								</div>
								{isExpired && (
									<span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium w-fit">
										Expirée
									</span>
								)}
							</div>
							{invite.group.description && (
								<DrawerDescription className="mt-2 text-base line-clamp-2">
									{invite.group.description}
								</DrawerDescription>
							)}
						</div>
					</div>

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
								<time className="text-xs px-2 py-0.5 rounded-full bg-muted">
									{formatDistanceToNow(new Date(invite.createdAt), {
										addSuffix: true,
										locale: fr,
									})}
								</time>
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
									<h3 className="text-lg font-medium flex items-center gap-2">
										<Users className="icon-base text-primary" />
										{invite.group.members.length} membre
										{invite.group.members.length > 1 ? "s" : ""}
									</h3>
								</div>

								{invite.group.members.length > 0 && (
									<div className="space-y-3">
										<div className="grid grid-cols-4 gap-3">
											{invite.group.members.map((member) => (
												<div
													key={member.userId}
													className="relative group aspect-square"
												>
													<Avatar className="h-10 w-10">
														<AvatarImage
															src={member.user.image ?? undefined}
															alt={member.user.name}
														/>
														<AvatarFallback className="text-xs">
															{member.user.name
																?.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm border">
														{member.user.name}
														{member.role === "ADMIN" && (
															<Crown className="inline-block ml-1 h-2.5 w-2.5 text-amber-500" />
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{isPending && !isExpired && (
							<div className="space-y-3 pb-safe">
								<form action={dispatch}>
									<input type="hidden" name="id" value={invite.id} />
									<input
										type="hidden"
										name="status"
										value={GroupInviteStatus.ACCEPTED}
									/>
									<Button
										size="lg"
										className="w-full justify-start font-medium text-base"
									>
										<Check className="mr-3 icon-base" />
										Accepter l&apos;invitation
									</Button>
								</form>
								<form action={dispatch}>
									<input type="hidden" name="id" value={invite.id} />
									<input
										type="hidden"
										name="status"
										value={GroupInviteStatus.REJECTED}
									/>
									<Button
										variant="outline"
										size="lg"
										className="w-full justify-start font-medium"
									>
										<X className="mr-3 h-4 w-4" />
										Refuser l&apos;invitation
									</Button>
								</form>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
