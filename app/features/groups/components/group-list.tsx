"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, PanInfo } from "framer-motion";
import { Settings, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GetGroupListResponse } from "../queries/get-group-list";

type Props = {
	groups: GetGroupListResponse;
	sessionId: string;
	className?: string;
};

const DRAG_THRESHOLD = -50;

export default function GroupList({ groups, sessionId, className }: Props) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [dragPositions, setDragPositions] = useState<{ [key: number]: number }>(
		{}
	);

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
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
		index: number
	) => {
		if (index === activeIndex) {
			setDragPositions((prev) => ({
				...prev,
				[index]: info.offset.x,
			}));
		}
	};

	const handleDragEnd = async (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
		index: number
	) => {
		if (index !== activeIndex) return;

		const finalPosition = info.offset.x < DRAG_THRESHOLD ? -100 : 0;
		setDragPositions((prev) => ({
			...prev,
			[index]: finalPosition,
		}));
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
							onDrag={(_, info) => handleDrag(_, info, index)}
							onDragEnd={(_, info) => handleDragEnd(_, info, index)}
							animate={{
								x: dragPositions[index] || 0,
							}}
							transition={{
								type: "spring",
								damping: 30,
								stiffness: 400,
							}}
						>
							<Card className="overflow-hidden transform-gpu transition-colors hover:bg-muted/50 active:bg-muted">
								<Link
									href={`/app/groups/${group.id}`}
									className="block touch-action-pan-y"
								>
									<div className="flex items-start p-4">
										{/* ... Le reste du contenu de la carte reste identique ... */}
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
