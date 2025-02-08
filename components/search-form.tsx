"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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

const SearchForm = ({ paramName, className, placeholder }: SearchFormProps) => {
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
			className={cn("relative flex w-full items-center gap-2", className)}
			action=""
		>
			<div className="relative flex-1">
				<div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
					{isPending ? (
						<Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
					) : (
						<Search className="text-muted-foreground h-5 w-5" />
					)}
				</div>

				<Input
					autoComplete="off"
					type="text"
					value={searchTerm}
					onChange={(e) => {
						setValue(paramName, e.target.value);
						debouncedSearch(e.target.value);
					}}
					className={cn(
						"pl-10 pr-10 h-12 rounded-2xl",
						"bg-muted/50 border-none",
						"placeholder:text-muted-foreground/70",
						"focus:ring-2 focus:ring-primary/20",
						"transition-shadow duration-200"
					)}
					placeholder={placeholder || "Rechercher..."}
					aria-label="Champ de recherche"
				/>

				{searchTerm && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className={cn(
							"absolute right-2 top-1/2 -translate-y-1/2",
							"h-8 w-8 rounded-full p-0",
							"hover:bg-muted/80",
							"transition-colors"
						)}
						onClick={clearSearch}
						aria-label="Effacer la recherche"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		</Form>
	);
};

export function SearchFormSkeleton() {
	return <Skeleton className="h-12 w-full rounded-2xl bg-muted/50" />;
}

export default SearchForm;
