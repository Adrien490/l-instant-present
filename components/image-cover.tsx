"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface ImageCoverProps {
	imageUrl?: string | null;
	alt: string;
	icon?: ReactNode;
	className?: string;
	children?: ReactNode;
	gradientFrom?: string;
	gradientTo?: string;
}

export default function ImageCover({
	imageUrl,
	alt,
	icon,
	className,
	children,
	gradientFrom = "primary",
	gradientTo = "primary",
}: ImageCoverProps) {
	return (
		<div
			className={cn(
				"relative flex-shrink-0 -mx-4 touch-action-pan-y overflow-hidden",
				className
			)}
		>
			{imageUrl ? (
				<div className="relative w-full aspect-[2/1]">
					<Image
						src={imageUrl}
						alt={alt}
						fill
						className="object-cover transform-gpu will-change-transform"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority
					/>
					<div
						className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
						aria-hidden="true"
					/>
				</div>
			) : (
				<div
					className={cn(
						"relative w-full aspect-[2/1]",
						`bg-gradient-to-br from-${gradientFrom}/20 to-${gradientTo}/10`
					)}
				>
					{icon && (
						<div className="absolute inset-0 flex items-center justify-center">
							{icon}
						</div>
					)}
					<div
						className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
						aria-hidden="true"
					/>
				</div>
			)}
			{children}
		</div>
	);
}
