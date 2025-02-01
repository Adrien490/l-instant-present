import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";
import Link from "next/link";

interface LogoProps {
	className?: string;
}

export default function Logo({ className }: LogoProps) {
	return (
		<Link
			href="/app"
			className={cn(
				"flex items-center gap-2 hover:opacity-80 transition-opacity",
				className
			)}
		>
			<Timer
				className="h-5 w-5 text-primary"
				strokeWidth={2.5}
				aria-hidden="true"
			/>
			<span className="font-semibold leading-none">L&apos;instant présent</span>
		</Link>
	);
}
