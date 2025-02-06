"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GetGroupListResponse } from "../queries/get-group-list";

type Props = {
	groups: GetGroupListResponse;
	sessionId: string;
	className?: string;
};

export default function GroupList({ groups, sessionId, className }: Props) {
	if (!groups) {
		return (
			<EmptyState
				title="Aucun groupe trouvé"
				description="Vous n'appartenez à aucun groupe"
				icon={
					<Users className="h-5 w-5 transform-gpu text-muted-foreground/80" />
				}
			/>
		);
	}

	return (
		<div className={cn("", className)}>
			{groups.map((group) => {
				const isOwner = group.members.some(
					(member: { user: { id: string } }) => member.user.id === sessionId
				);
				return (
					<Card
						key={group.id}
						className="overflow-hidden transform-gpu transition-colors hover:bg-muted/50 active:bg-muted"
					>
						<div className="relative">
							<Link
								href={`/app/groups/${group.id}`}
								className="block touch-action-pan-y"
							>
								<div className="flex gap-4 p-4">
									<div className="relative flex-shrink-0">
										{group.imageUrl ? (
											<div className="relative w-14 h-14">
												<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
												<Image
													src={group.imageUrl}
													alt={group.name}
													fill
													className="object-cover rounded-lg transform-gpu"
													sizes="56px"
												/>
												{isOwner && (
													<div className="absolute -top-1 -right-1 rounded-full bg-background p-1 shadow-sm transform-gpu">
														<Crown className="h-5 w-5 text-amber-500" />
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
																className="relative aspect-square bg-cover bg-center transform-gpu"
																style={{
																	backgroundImage: `url(${member.user.image})`,
																}}
															/>
														))}
													</div>
												</div>
												{isOwner && (
													<div className="absolute -top-1 -right-1 rounded-full bg-background p-1 shadow-sm transform-gpu">
														<Crown className="h-5 w-5 text-amber-500" />
													</div>
												)}
											</div>
										) : (
											<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
												<Users className="h-5 w-5 text-primary transform-gpu" />
												{isOwner && (
													<div className="absolute -top-1 -right-1 rounded-full bg-background p-1 shadow-sm transform-gpu">
														<Crown className="h-5 w-5 text-amber-500" />
													</div>
												)}
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0 py-2 spacing-2025-compact">
										<div className="flex items-center gap-3">
											<p className="text-lg font-medium leading-tight tracking-tight md:tracking-normal truncate text-foreground/90 antialiased">
												{group.name}
											</p>
										</div>

										<div className="mt-2 flex flex-col gap-2">
											<div className="flex items-center gap-2">
												<span className="text-sm leading-normal md:leading-relaxed antialiased text-muted-foreground flex items-center gap-2">
													<Users className="h-5 w-5 transform-gpu" />
													{group.members.length} membre
													{group.members.length > 1 ? "s" : ""}
												</span>
											</div>

											{group.description && (
												<p className="text-sm leading-relaxed antialiased text-muted-foreground/80 line-clamp-2">
													{group.description}
												</p>
											)}
										</div>
									</div>
								</div>
							</Link>
							<div className="absolute right-2 top-1/2 -translate-y-1/2">
								<Button
									variant="ghost"
									size="icon"
									className="touch-target-2025 min-h-[44px] min-w-[44px] transform-gpu transition-transform hover:scale-105 active:scale-95"
									asChild
								>
									<Link href={`/app/my-groups/${group.id}`}>
										<Settings className="h-5 w-5" />
										<span className="sr-only">
											Paramètres du groupe {group.name}
										</span>
									</Link>
								</Button>
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
