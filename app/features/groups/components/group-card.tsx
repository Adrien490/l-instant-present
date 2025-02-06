"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Crown, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { GetGroupListResponse } from "../queries/get-group-list";

type GroupData = GetGroupListResponse[number];

type Props = {
	group: GroupData;
	isOwner: boolean;
};

export default function GroupCard({ group, isOwner }: Props) {
	const cardRef = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const background = useTransform(
		x,
		[-100, 0, 100],
		["rgb(239 68 68 / 0.2)", "transparent", "rgb(34 197 94 / 0.2)"]
	);

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		const threshold = 100;
		if (Math.abs(info.offset.x) > threshold) {
			if (info.offset.x > 0) {
				window.location.href = `/app/groups/${group.id}`;
			} else {
				window.location.href = `/app/my-groups/${group.id}`;
			}
		}
	};

	return (
		<motion.div
			style={{ background }}
			className="relative rounded-lg overflow-hidden"
		>
			<motion.div
				ref={cardRef}
				drag="x"
				dragConstraints={{ left: 0, right: 0 }}
				dragElastic={0.1}
				onDragEnd={handleDragEnd}
				style={{ x }}
				className="touch-none"
			>
				<Card className="overflow-hidden bg-card">
					<div className="relative flex items-start p-4">
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

						{/* Settings Button */}
						<div className="flex-shrink-0 ml-2">
							<Button
								variant="ghost"
								size="icon"
								className="touch-target-2025 h-11 w-11 rounded-full transform-gpu transition-transform hover:scale-105 active:scale-95"
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
			</motion.div>

			{/* Swipe Indicators */}
			<div
				className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-0 transition-opacity duration-200"
				style={{ opacity: x.get() > 50 ? 1 : 0 }}
			>
				<span className="text-sm font-medium text-green-600">
					Voir le groupe →
				</span>
			</div>
			<div
				className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 transition-opacity duration-200"
				style={{ opacity: x.get() < -50 ? 1 : 0 }}
			>
				<span className="text-sm font-medium text-red-600">← Paramètres</span>
			</div>
		</motion.div>
	);
}
