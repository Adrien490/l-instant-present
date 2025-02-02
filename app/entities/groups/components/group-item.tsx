"use client";

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
import { GroupRole } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, Edit, Trash, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GetGroupResponse } from "../queries/get-group";

type Props = {
	group: GetGroupResponse;
	isOwner: boolean;
};

export default function GroupItem({ group, isOwner }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
					<div className="flex gap-4 p-4">
						<div className="relative flex-shrink-0">
							{group.imageUrl ? (
								<div className="relative w-14 h-14">
									<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
									<Image
										src={group.imageUrl}
										alt={group.name}
										fill
										className="object-cover rounded-lg"
										sizes="56px"
									/>
									{isOwner && (
										<div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
											<Crown className="h-3.5 w-3.5 text-amber-500" />
										</div>
									)}
								</div>
							) : group.members.length > 0 ? (
								<div className="relative w-14 h-14">
									<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
									<div className="absolute inset-[3px] rounded-lg overflow-hidden">
										<div className="grid grid-cols-2 gap-[2px]">
											{group.members.slice(0, 4).map((member) => (
												<div
													key={member.user.id}
													className="relative aspect-square bg-cover bg-center"
													style={{
														backgroundImage: `url(${member.user.image})`,
													}}
												/>
											))}
										</div>
									</div>
									{isOwner && (
										<div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
											<Crown className="h-3.5 w-3.5 text-amber-500" />
										</div>
									)}
								</div>
							) : (
								<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
									<Users className="h-6 w-6 text-primary" />
									{isOwner && (
										<div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
											<Crown className="h-3.5 w-3.5 text-amber-500" />
										</div>
									)}
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0 py-1">
							<div className="flex items-center gap-2">
								<p className="font-medium text-base truncate text-foreground/90">
									{group.name}
								</p>
							</div>

							<div className="mt-1.5 flex flex-col gap-1.5">
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5" />
										{group.members.length} membre
										{group.members.length > 1 ? "s" : ""}
									</span>
								</div>

								{group.description && (
									<p className="text-sm text-muted-foreground/80 line-clamp-2">
										{group.description}
									</p>
								)}
							</div>
						</div>
					</div>
				</Card>
			</DrawerTrigger>

			<DrawerContent className="h-[94vh] flex flex-col px-0 pb-32">
				<ScrollArea className="flex-1">
					<div className="relative flex-shrink-0">
						{group.imageUrl ? (
							<div className="relative w-full aspect-[2/1]">
								<Image
									src={group.imageUrl}
									alt={group.name}
									fill
									className="object-cover"
									sizes="100vw"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
							</div>
						) : (
							<div className="relative w-full aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/10">
								<div className="absolute inset-0 flex items-center justify-center">
									<Users className="h-12 w-12 text-primary" />
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
							</div>
						)}

						<div className="absolute bottom-0 left-0 right-0 p-6">
							<div className="flex flex-col gap-3">
								<DrawerTitle className="text-2xl font-semibold flex items-center gap-2 text-white">
									{group.name}
									{isOwner && (
										<Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
									)}
								</DrawerTitle>
								<div className="flex items-center gap-2 flex-wrap">
									<time className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
										{formatDistanceToNow(new Date(group.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
									<div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
										{group.members.length} membre
										{group.members.length > 1 ? "s" : ""}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="p-6 space-y-6">
						{group.description && (
							<DrawerDescription className="text-base text-muted-foreground">
								{group.description}
							</DrawerDescription>
						)}

						<div className="bg-muted rounded-2xl overflow-hidden">
							<div className="p-6 space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-base font-medium flex items-center gap-2">
										<Users className="h-4.5 w-4.5 text-primary" />
										Membres du groupe
									</h3>
								</div>

								{group.members.length > 0 && (
									<div className="space-y-4">
										<div className="flex flex-wrap gap-2">
											{group.members.map((member) => (
												<div key={member.user.id} className="group relative">
													<div
														className="h-11 w-11 rounded-full ring-2 ring-background transition-transform hover:scale-105"
														style={{
															backgroundImage: `url(${member.user.image})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
														}}
													/>
													<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-xs px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm border">
														{member.user.name}
														{member.role === GroupRole.ADMIN && (
															<Crown className="inline-block ml-1.5 h-3.5 w-3.5 text-amber-500" />
														)}
													</div>
												</div>
											))}
										</div>
										<div className="text-sm text-muted-foreground">
											<div className="line-clamp-2">
												{group.members.map((m) => m.user.name).join(", ")}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-3 pb-safe">
							<Button
								size="lg"
								className="w-full justify-start font-medium text-base"
								asChild
							>
								<Link href={`/app/groups/${group.id}`}>
									<Users className="mr-3 h-5 w-5" />
									Accéder au groupe
								</Link>
							</Button>

							{isOwner ? (
								<>
									<Button
										variant="outline"
										size="lg"
										className="w-full justify-start font-medium text-base"
										asChild
									>
										<Link href={`/app/my-groups/${group.id}/edit`}>
											<Edit className="mr-3 h-5 w-5" />
											Modifier
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="lg"
										className="w-full justify-start font-medium text-base"
									>
										<Trash className="mr-3 h-5 w-5" />
										Supprimer
									</Button>
								</>
							) : (
								<Button
									variant="destructive"
									size="lg"
									className="w-full justify-start font-medium text-base"
								>
									<Trash className="mr-3 h-5 w-5" />
									Quitter le groupe
								</Button>
							)}
						</div>
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
