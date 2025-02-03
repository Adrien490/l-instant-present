"use client";

import { Button } from "@/components/ui/button";
import { GroupRole } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, Edit, Trash, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GetGroupResponse } from "../queries/get-group";

type Props = {
	group: GetGroupResponse;
	isOwner: boolean;
};

export default function GroupItem({ group, isOwner }: Props) {
	return (
		<div className="flex flex-col safe-area-x touch-action-pan-y">
			<div className="relative flex-shrink-0">
				{group.imageUrl ? (
					<div className="relative w-full aspect-[2/1]">
						<Image
							src={group.imageUrl}
							alt={group.name}
							fill
							className="object-cover transform-gpu"
							sizes="100vw"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
					</div>
				) : (
					<div className="relative w-full aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/10">
						<div className="absolute inset-0 flex items-center justify-center">
							<Users className="h-5 w-5 text-primary transform-gpu" />
						</div>
						<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
					</div>
				)}

				<div className="absolute bottom-0 left-0 right-0 p-4">
					<div className="flex flex-col gap-4">
						<h2 className="text-lg font-medium leading-tight tracking-tight md:tracking-normal flex items-center gap-3 text-white antialiased">
							{group.name}
							{isOwner && (
								<Crown className="h-5 w-5 text-amber-500 flex-shrink-0 transform-gpu" />
							)}
						</h2>
						<div className="flex items-center gap-2 flex-wrap">
							<time className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white">
								{formatDistanceToNow(new Date(group.createdAt), {
									addSuffix: true,
									locale: fr,
								})}
							</time>
							<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white">
								{group.members.length} membre
								{group.members.length > 1 ? "s" : ""}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="py-4 space-y-4">
				<p className="text-base leading-normal md:leading-relaxed antialiased text-muted-foreground">
					{group.description}
				</p>

				<div className="bg-muted rounded-xl overflow-hidden">
					<div className="p-4 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-medium leading-tight tracking-tight md:tracking-normal antialiased flex items-center gap-2">
								<Users className="h-5 w-5 text-primary transform-gpu" />
								Membres du groupe
							</h3>
						</div>

						{group.members.length > 0 && (
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2">
									{group.members.map((member) => (
										<div
											key={member.user.id}
											className="group relative touch-target-2025"
										>
											<div
												className="h-10 w-10 rounded-full ring-2 ring-background transition-transform hover:scale-105 transform-gpu"
												style={{
													backgroundImage: `url(${member.user.image})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}}
											/>
											<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-sm leading-normal antialiased px-2 py-1 rounded-full whitespace-nowrap shadow-sm border">
												{member.user.name}
												{member.role === GroupRole.ADMIN && (
													<Crown className="inline-block ml-1.5 h-5 w-5 text-amber-500 transform-gpu" />
												)}
											</div>
										</div>
									))}
								</div>
								<div className="text-sm leading-normal antialiased text-muted-foreground">
									<div className="line-clamp-2">
										{group.members.map((m) => m.user.name).join(", ")}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="space-y-4 pb-32 safe-area-bottom">
					{isOwner ? (
						<>
							<Button
								variant="outline"
								size="lg"
								className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
								asChild
							>
								<Link href={`/app/my-groups/${group.id}/edit`}>
									<Edit className="mr-3 h-5 w-5 transform-gpu" />
									Modifier
								</Link>
							</Button>
							<Button
								variant="destructive"
								size="lg"
								className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
								asChild
							>
								<Link href={`/app/my-groups/${group.id}/delete`}>
									<Trash className="mr-3 h-5 w-5 transform-gpu" />
									Supprimer
								</Link>
							</Button>
						</>
					) : (
						<Button
							variant="destructive"
							size="lg"
							className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
							asChild
						>
							<Link href={`/app/groups/${group.id}/leave`}>
								<Trash className="mr-3 h-5 w-5 transform-gpu" />
								Quitter le groupe
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
