"use client";

import { Card } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useMemo } from "react";
import carouselItems from "../lib/carousel-items";

export default function AuthCarousel() {
	const plugin = useMemo(
		() =>
			Autoplay({
				delay: 4000,
				stopOnInteraction: true,
				stopOnMouseEnter: true,
			}),
		[]
	);

	return (
		<Carousel
			opts={{
				align: "center",
				loop: true,
			}}
			plugins={[plugin]}
			className="w-full"
		>
			<CarouselContent>
				{carouselItems.map((item) => (
					<CarouselItem key={item.id}>
						<Card
							className={cn(
								"border-none bg-transparent overflow-hidden",
								"transition-all duration-300"
							)}
						>
							<div className="relative aspect-square">
								<Image
									src={item.src}
									alt={item.alt}
									fill
									priority
									className="object-cover rounded-xl"
								/>
							</div>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
