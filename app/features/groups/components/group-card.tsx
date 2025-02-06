"use client";

import { Card } from "@/components/ui/card";
import { Crown, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Type as ListType,
	SwipeableList,
	SwipeableListItem,
	SwipeAction,
	TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { GetGroupListResponse } from "../queries/get-group-list";

type GroupData = GetGroupListResponse[number];

type Props = {
	group: GroupData;
	isOwner: boolean;
};

export default function GroupCard({ group, isOwner }: Props) {
	const trailingActions = () => (
		<TrailingActions>
			<SwipeAction
				onClick={() => (window.location.href = `/app/my-groups/${group.id}`)}
			>
				<div className="h-full w-24 flex items-center bg-muted">
					<div className="h-full w-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors">
						<Settings className="h-5 w-5" />
					</div>
				</div>
			</SwipeAction>
		</TrailingActions>
	);

	return (
		<div className="w-full">
			<SwipeableList threshold={0.5} type={ListType.IOS}>
				<SwipeableListItem trailingActions={trailingActions()}>
					<Card className="overflow-hidden border-none w-full">
						<Link href={`/app/groups/${group.id}`} className="block w-full">
							<div className="relative flex items-start p-4 w-full">
								{/* Rest of the component code remains the same */}
								{/* Image Section */}
								<div className="relative flex-shrink-0 mt-1">
									{group.imageUrl ? (
										<div className="relative w-16 h-16">
											<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
											<Image
												src={group.imageUrl}
												alt={group.name}
												fill
												className="object-cover rounded-lg"
												sizes="64px"
												loading="lazy"
												quality={75}
											/>
											{isOwner && (
												<div className="absolute -top-1 -right-1 rounded-full bg-background p-1 shadow-sm transform-gpu">
													<Crown className="h-4 w-4 text-amber-500" />
												</div>
											)}
										</div>
									) : group.members.length > 0 ? (
										<div className="relative w-16 h-16">
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
													<Crown className="h-4 w-4 text-amber-500" />
												</div>
											)}
										</div>
									) : (
										<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
											<Users className="h-6 w-6 text-primary transform-gpu" />
											{isOwner && (
												<div className="absolute -top-1 -right-1 rounded-full bg-background p-1 shadow-sm transform-gpu">
													<Crown className="h-4 w-4 text-amber-500" />
												</div>
											)}
										</div>
									)}
								</div>

								{/* Content Section */}
								<div className="flex-1 min-w-0 ml-4 py-1">
									<h3 className="text-base font-medium leading-tight tracking-tight md:tracking-normal truncate text-foreground antialiased">
										{group.name}
									</h3>

									<div className="mt-2 flex flex-col gap-1.5">
										<div className="flex items-center">
											<span className="text-sm leading-normal antialiased text-muted-foreground flex items-center gap-1.5">
												<Users className="h-4 w-4 transform-gpu" />
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
					</Card>
				</SwipeableListItem>
			</SwipeableList>
		</div>
	);
}
