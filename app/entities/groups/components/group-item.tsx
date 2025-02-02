"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, Edit, Trash, Users } from "lucide-react";
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
		<Sheet open={open} onOpenChange={setOpen} modal={true}>
			<SheetTrigger asChild>
				<Card className="overflow-hidden transition-all hover:bg-muted/50 active:bg-muted">
					<div className="flex items-center gap-4 p-4">
						<div className="rounded-xl bg-primary/10 p-3 shadow-sm">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<p className="font-medium leading-none truncate text-foreground/80">
									{group.name}
								</p>
								{isOwner && (
									<Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
								)}
							</div>
							<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground/90">
								<span className="flex items-center gap-1">
									<Users className="h-3.5 w-3.5" />
									{group.members.length} membre
									{group.members.length > 1 ? "s" : ""}
								</span>
								<span className="text-xs text-muted-foreground/70">
									Créé{" "}
									{formatDistanceToNow(new Date(group.createdAt), {
										addSuffix: true,
										locale: fr,
									})}
								</span>
							</div>
							{group.description && (
								<p className="mt-2 text-sm text-muted-foreground/80 line-clamp-1">
									{group.description}
								</p>
							)}
						</div>
					</div>
				</Card>
			</SheetTrigger>

			<SheetContent
				side="bottom"
				className="h-[90vh] flex flex-col p-0 pb-[calc(72px+max(env(safe-area-inset-bottom),16px))]"
			>
				<SheetHeader className="flex-shrink-0 text-left p-6 pb-4 border-b">
					<div className="flex items-start gap-4">
						<div className="rounded-xl bg-primary/10 p-3">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<SheetTitle className="text-xl font-semibold">
									{group.name}
								</SheetTitle>
								{isOwner && (
									<Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
								)}
							</div>
							{group.description && (
								<SheetDescription className="mt-2 text-sm line-clamp-2">
									{group.description}
								</SheetDescription>
							)}
						</div>
					</div>
				</SheetHeader>

				<ScrollArea className="flex-1">
					<div className="p-6 space-y-6">
						<div className="bg-muted/50 rounded-xl p-4">
							<div className="flex flex-col space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5 text-primary" />
										{group.members.length} membre
										{group.members.length > 1 ? "s" : ""}
									</h3>
									<time className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
										{formatDistanceToNow(new Date(group.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
								</div>

								{group.members.length > 0 && (
									<div className="space-y-3">
										<div className="flex -space-x-2 overflow-hidden">
											{group.members.slice(0, 8).map((member) => (
												<div
													key={member.user.id}
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
													</div>
												</div>
											))}
											{group.members.length > 8 && (
												<div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background">
													<span className="text-[10px] font-medium">
														+{group.members.length - 8}
													</span>
												</div>
											)}
										</div>
										<div className="text-[10px] text-muted-foreground/70 line-clamp-1">
											<span className="font-medium">Membres : </span>
											{group.members.map((m) => m.user.name).join(", ")}
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-3 pb-safe">
							<Button
								size="lg"
								className="w-full justify-start font-medium"
								asChild
							>
								<Link href={`/app/groups/${group.id}`}>
									<Users className="mr-3 h-4 w-4" />
									Accéder au groupe
								</Link>
							</Button>

							{isOwner ? (
								<>
									<Button
										variant="outline"
										size="lg"
										className="w-full justify-start font-medium"
										asChild
									>
										<Link href={`/app/my-groups/${group.id}/edit`}>
											<Edit className="mr-3 h-4 w-4" />
											Modifier
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="lg"
										className="w-full justify-start font-medium"
									>
										<Trash className="mr-3 h-4 w-4" />
										Supprimer
									</Button>
								</>
							) : (
								<Button
									variant="destructive"
									size="lg"
									className="w-full justify-start font-medium"
								>
									<Trash className="mr-3 h-4 w-4" />
									Quitter le groupe
								</Button>
							)}
						</div>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
