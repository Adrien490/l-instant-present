"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface ImageCoverProps {
	imageUrl?: string | null;
	alt: string;
	className?: string;
	children?: ReactNode;
	gradientFrom?: string;
	gradientTo?: string;
	aspectRatio?: "video" | "square" | "portrait" | "landscape";
	loading?: "eager" | "lazy";
	quality?: number;
}

const aspectRatioMap = {
	video: "aspect-video",
	square: "aspect-square",
	portrait: "aspect-[3/4]",
	landscape: "aspect-[2/1]",
} as const;

export default function ImageCover({
	imageUrl,
	alt,
	className,
	children,
	gradientFrom = "primary",
	gradientTo = "primary",
	aspectRatio = "landscape",
	loading = "eager",
	quality = 85,
}: ImageCoverProps) {
	const containerClasses = cn(
		"relative flex-shrink-0 -mx-4 touch-action-pan-y overflow-hidden",
		"transition-opacity duration-300 ease-in-out",
		className
	);

	const imageContainerClasses = cn(
		"relative w-full",
		aspectRatioMap[aspectRatio]
	);

	const imageClasses = cn(
		"object-cover transform-gpu will-change-transform",
		"transition-transform duration-300 ease-in-out",
		"hover:scale-105"
	);

	const gradientClasses = cn(
		"absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent",
		"transition-opacity duration-300 ease-in-out"
	);

	const placeholderClasses = cn(
		"relative w-full",
		aspectRatioMap[aspectRatio],
		`bg-gradient-to-br from-${gradientFrom}/20 to-${gradientTo}/10`,
		"transition-all duration-300 ease-in-out"
	);

	return (
		<div className={containerClasses}>
			{imageUrl ? (
				<div className={imageContainerClasses}>
					<Image
						src={imageUrl}
						alt={alt}
						fill
						className={imageClasses}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						priority={loading === "eager"}
						quality={quality}
						loading={loading}
					/>
					<div className={gradientClasses} aria-hidden="true" />
				</div>
			) : (
				<div className={placeholderClasses}>
					<div className={gradientClasses} aria-hidden="true" />
				</div>
			)}
			{children}
		</div>
	);
}
