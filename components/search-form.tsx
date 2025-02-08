"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

type SearchFormProps = {
	paramName: string;
	className?: string;
	placeholder?: string;
};

export default function SearchForm({
	paramName,
	className,
	placeholder,
}: SearchFormProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const { watch, setValue, handleSubmit } = useForm({
		defaultValues: {
			[paramName]: searchParams?.get(paramName) || "",
		},
	});

	const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
		const newSearchParams = new URLSearchParams(searchParams?.toString() || "");
		if (searchTerm) {
			newSearchParams.set(paramName, searchTerm);
		} else {
			newSearchParams.delete(paramName);
		}
		startTransition(() => {
			router.replace(`?${newSearchParams.toString()}`, { scroll: false });
		});
	}, 300);

	const clearSearch = () => {
		const newSearchParams = new URLSearchParams(searchParams?.toString() || "");
		newSearchParams.delete(paramName);
		startTransition(() => {
			router.replace(`?${newSearchParams.toString()}`, { scroll: false });
		});
		setValue(paramName, "");
	};

	const searchTerm = watch(paramName);

	return (
		<Form
			onSubmit={handleSubmit((data) => {
				debouncedSearch(data[paramName]);
			})}
			data-pending={isPending ? "" : undefined}
			className={cn("relative flex w-full items-center", className)}
			action=""
		>
			<div className="relative w-full">
				<Input
					autoComplete="off"
					type="text"
					value={searchTerm}
					onChange={(e) => {
						setValue(paramName, e.target.value);
						debouncedSearch(e.target.value);
					}}
					className={cn(
						"pl-12 pr-12 h-12 rounded-2xl",
						"bg-muted/50 border-none",
						"placeholder:text-muted-foreground/70",
						"shadow-sm",
						"focus:ring-2 focus:ring-primary/20 focus:shadow-md",
						"transition-all duration-200"
					)}
					placeholder={placeholder || "Rechercher..."}
					aria-label="Champ de recherche"
				/>

				{/* Icône de recherche/loader */}
				<div className="absolute left-4 top-1/2 -translate-y-1/2">
					<AnimatePresence mode="wait">
						{isPending ? (
							<motion.div
								key="loader"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="text-primary"
							>
								<Loader2 className="h-5 w-5 animate-spin" />
							</motion.div>
						) : (
							<motion.div
								key="search"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<Search className="h-5 w-5 text-muted-foreground" />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Bouton clear */}
				<AnimatePresence>
					{searchTerm && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute right-2 top-1/2 -translate-y-1/2"
						>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className={cn(
									"h-8 w-8 rounded-xl p-0",
									"hover:bg-muted/80",
									"transition-colors"
								)}
								onClick={clearSearch}
								aria-label="Effacer la recherche"
							>
								<X className="h-4 w-4" />
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Form>
	);
}

export function SearchFormSkeleton() {
	return <Skeleton className="h-12 w-full rounded-2xl bg-muted/50" />;
}
