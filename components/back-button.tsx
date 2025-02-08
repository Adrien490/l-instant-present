"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function BackButton() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	return (
		<Button
			onClick={() => startTransition(() => router.back())}
			variant="ghost"
			size="icon"
			className={cn(
				"rounded-full w-10 h-10",
				"bg-background/80 hover:bg-accent",
				"active:scale-95",
				"transition-all duration-200",
				"tap-highlight-transparent",
				"backdrop-blur-sm"
			)}
			aria-label="Retour"
			disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="h-5 w-5 animate-spin" />
			) : (
				<ChevronLeft className="h-5 w-5" />
			)}
		</Button>
	);
}
