"use client";

import { Card } from "@/components/ui/card";
import { Crown, Eye, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { Edit, Trash2 } from "lucide-react";

type Props = {
	group: GroupData;
	isOwner: boolean;
	canEdit: boolean;
	canDelete: boolean;
};

export default function GroupCard({
	group,
	isOwner,
	canEdit,
	canDelete,
}: Props) {
	const router = useRouter();
	const trailingActions = () => (
		<TrailingActions>
			<SwipeAction onClick={() => router.push(`/app/my-groups/${group.id}`)}>
				<div className="h-full flex items-center justify-end">
					{canEdit && (
						<Link
							href={`/app/my-groups/${group.id}/edit`}
							className="h-full w-16 flex items-center justify-center bg-muted/95 backdrop-blur-sm text-muted-foreground hover:bg-muted/80 active:bg-muted/70 transition-all"
						>
							<Edit className="h-5 w-5" />
						</Link>
					)}
					{canDelete && (
						<Link
							href={`/app/my-groups/${group.id}/delete`}
							className="h-full w-16 flex items-center justify-center bg-destructive/10 backdrop-blur-sm text-destructive hover:bg-destructive/20 active:bg-destructive/30 transition-all"
						>
							<Trash2 className="h-5 w-5" />
						</Link>
					)}

					<Link
						href={`/app/my-groups/${group.id}`}
						className="h-full w-16 flex items-center justify-center bg-primary/10 backdrop-blur-sm text-primary hover:bg-primary/20 active:bg-primary/30 transition-all"
					>
						<Eye className="h-5 w-5" />
					</Link>
				</div>
			</SwipeAction>
		</TrailingActions>
	);

	return (
		<div className="w-full">
			<SwipeableList threshold={0.5} type={ListType.IOS}>
				<SwipeableListItem trailingActions={trailingActions()}>
					<Card className="overflow-hidden">
						<Link href={`/app/groups/${group.id}`} className="block w-full">
							<div className="relative flex items-start p-4 w-full">
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
											<Users className="h-6 w-6 text-primary" />
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
												<Users className="h-4 w-4" />
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
