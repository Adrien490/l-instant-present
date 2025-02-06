"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Crown, Settings, Trash2, Users } from "lucide-react";
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
		<div className={cn("space-y-3", className)}>
			{groups.map((group) => (
				<GroupCard key={group.id} group={group} sessionId={sessionId} />
			))}
		</div>
	);
}

function GroupCard({
	group,
	sessionId,
}: {
	group: Props["groups"][0];
	sessionId: string;
}) {
	const x = useMotionValue(0);
	const opacity = useTransform(x, [-100, -50, 0], [1, 0.8, 0]);
	const scale = useTransform(x, [-100, -50, 0], [1, 0.95, 1]);

	const isOwner = group.members.some(
		(member: { user: { id: string } }) => member.user.id === sessionId
	);

	return (
		<div className="relative overflow-hidden rounded-2xl">
			{/* Actions révélées */}
			<motion.div
				className="absolute right-0 h-full flex items-center gap-3 px-6"
				style={{ opacity }}
			>
				<Link href={`/app/my-groups/${group.id}`}>
					<Button
						variant="ghost"
						size="icon"
						className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
					>
						<Settings className="h-5 w-5 text-primary" />
					</Button>
				</Link>
				{isOwner && (
					<Button
						variant="ghost"
						size="icon"
						className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm"
					>
						<Trash2 className="h-5 w-5 text-destructive" />
					</Button>
				)}
			</motion.div>

			{/* Carte principale */}
			<motion.div
				drag="x"
				dragConstraints={{ left: -100, right: 0 }}
				dragElastic={0.2}
				dragMomentum={false}
				whileTap={{ cursor: "grabbing" }}
				style={{ x, scale }}
				transition={{
					type: "spring",
					damping: 20,
					stiffness: 300,
				}}
			>
				<Card className="overflow-hidden border-0 shadow-sm">
					<Link
						href={`/app/groups/${group.id}`}
						className="block touch-action-pan-y"
					>
						<div className="flex items-start p-4">
							{/* Image Section */}
							<div className="relative flex-shrink-0 mt-1">
								{group.imageUrl ? (
									<div className="relative w-16 h-16">
										<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10" />
										<Image
											src={group.imageUrl}
											alt={group.name}
											fill
											className="object-cover rounded-lg transform-gpu"
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
							<div className="flex-1 min-w-0 ml-4">
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
			</motion.div>

			{/* Indicateur de swipe */}
			<motion.div
				className="absolute left-0 top-0 bottom-0 w-1 bg-destructive/20"
				style={{
					scaleY: useTransform(x, [-100, 0], [1, 0]),
					opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]),
				}}
			/>
		</div>
	);
}
