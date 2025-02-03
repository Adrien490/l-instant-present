"use client";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Image from "next/image";

interface GroupCoverImageProps {
	imageUrl?: string | null;
	name: string;
	className?: string;
}

export default function GroupCoverImage({
	imageUrl,
	name,
	className,
}: GroupCoverImageProps) {
	return (
		<div className={cn("relative flex-shrink-0 -mx-4", className)}>
			{imageUrl ? (
				<div className="relative w-full aspect-[2/1]">
					<Image
						src={imageUrl}
						alt={name}
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
		</div>
	);
}
