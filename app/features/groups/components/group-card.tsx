"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Crown, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "react-swipeable-list/dist/styles.css";
import { GetGroupListResponse } from "../queries/get-group-list";

type GroupData = GetGroupListResponse[number];

type Props = {
	group: GroupData;
	isOwner: boolean;
};

export default function GroupCard({ group, isOwner }: Props) {
	return (
		<Card className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-background via-background to-background/80 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
			<Link
				href={`/app/groups/${group.id}/challenge-periods`}
				className="block w-full"
			>
				<div className="relative flex items-center p-4 md:p-5 w-full gap-4 md:gap-6">
					{/* Image Section avec animation au hover */}
					<div className="relative flex-shrink-0">
						{group.imageUrl ? (
							<div className="relative w-[72px] h-[72px] md:w-24 md:h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
								<Image
									src={group.imageUrl}
									alt={group.name}
									fill
									className="object-cover rounded-2xl"
									sizes="(max-width: 768px) 72px, 96px"
									loading="lazy"
									quality={90}
								/>
								{isOwner && (
									<div className="absolute -top-1 -right-1 rounded-full bg-background/95 p-1.5 shadow-lg backdrop-blur-sm transform-gpu">
										<Crown className="h-4 w-4 text-amber-500" />
									</div>
								)}
							</div>
						) : group.members.length > 0 ? (
							<div className="relative w-[72px] h-[72px] md:w-24 md:h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
								<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute inset-[3px] rounded-xl overflow-hidden">
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
									<div className="absolute -top-1 -right-1 rounded-full bg-background/95 p-1.5 shadow-lg backdrop-blur-sm transform-gpu">
										<Crown className="h-4 w-4 text-amber-500" />
									</div>
								)}
							</div>
						) : (
							<div className="relative w-[72px] h-[72px] md:w-24 md:h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
								<div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
									<Users className="h-8 w-8 text-primary" />
								</div>
								{isOwner && (
									<div className="absolute -top-1 -right-1 rounded-full bg-background/95 p-1.5 shadow-lg backdrop-blur-sm transform-gpu">
										<Crown className="h-4 w-4 text-amber-500" />
									</div>
								)}
							</div>
						)}
					</div>

					{/* Content Section */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-4">
							<h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors duration-200">
								{group.name}
							</h3>
							<ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
						</div>

						<div className="mt-2 md:mt-3 space-y-3">
							<div className="flex items-center">
								<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
									<Users className="h-4 w-4" />
									<span className="text-sm font-medium">
										{group.members.length} membre
										{group.members.length > 1 ? "s" : ""}
									</span>
								</span>
							</div>

							{group.description && (
								<p className="text-sm md:text-base leading-relaxed text-muted-foreground/80 line-clamp-2 group-hover:text-muted-foreground transition-colors duration-300">
									{group.description}
								</p>
							)}
						</div>
					</div>
				</div>
			</Link>
		</Card>
	);
}
