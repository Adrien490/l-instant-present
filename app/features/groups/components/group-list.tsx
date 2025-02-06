"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, PanInfo, useAnimationControls } from "framer-motion";
import { Settings, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GetGroupListResponse } from "../queries/get-group-list";

type Props = {
	groups: GetGroupListResponse;
	sessionId: string;
	className?: string;
};

const DRAG_THRESHOLD = -50; // Seuil de glissement pour activer les actions

export default function GroupList({ groups, sessionId, className }: Props) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const controls = useAnimationControls();

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

	const handleDragStart = (index: number) => {
		setActiveIndex(index);
	};

	const handleDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
		index: number
	) => {
		if (index === activeIndex) {
			controls.set({ x: info.offset.x });
		}
	};

	const handleDragEnd = async (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
		index: number
	) => {
		if (index !== activeIndex) return;

		if (info.offset.x < DRAG_THRESHOLD) {
			await controls.start({ x: -100 });
		} else {
			await controls.start({ x: 0 });
		}
		setActiveIndex(null);
	};

	return (
		<div className={cn("space-y-3", className)}>
			{groups.map((group, index) => {
				const isOwner = group.members.some(
					(member: { user: { id: string } }) => member.user.id === sessionId
				);

				return (
					<div key={group.id} className="relative overflow-hidden">
						{/* Actions révélées */}
						<div className="absolute right-0 h-full flex items-center gap-2 px-4 bg-red-500/10">
							<Link href={`/app/my-groups/${group.id}`}>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
								>
									<Settings className="h-5 w-5 text-primary" />
								</Button>
							</Link>
							{isOwner && (
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-full bg-destructive/10 hover:bg-destructive/20"
								>
									<Trash2 className="h-5 w-5 text-destructive" />
								</Button>
							)}
						</div>

						{/* Carte principale */}
						<motion.div
							drag="x"
							dragConstraints={{ left: -100, right: 0 }}
							dragElastic={0.1}
							dragMomentum={false}
							onDragStart={() => handleDragStart(index)}
							onDrag={(e, info) => handleDrag(e, info, index)}
							onDragEnd={(e, info) => handleDragEnd(e, info, index)}
							animate={activeIndex === index ? controls : undefined}
						>
							<Card className="overflow-hidden transform-gpu transition-colors hover:bg-muted/50 active:bg-muted">
								<Link
									href={`/app/groups/${group.id}`}
									className="block touch-action-pan-y"
								>
									<div className="flex items-start p-4">
										{/* Image Section */}
										<div className="relative flex-shrink-0 mt-1">
											{/* ... (reste du code pour l'image) ... */}
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
					</div>
				);
			})}
		</div>
	);
}
