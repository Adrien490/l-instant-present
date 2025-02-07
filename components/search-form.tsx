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
	paramName: string; // Le nom du paramètre de recherche à gérer
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
		setValue(paramName, ""); // Reset form value
	};

	const searchTerm = watch(paramName); // Watch real-time changes

	return (
		<Form
			onSubmit={handleSubmit((data) => {
				debouncedSearch(data[paramName]);
			})}
			data-pending={isPending ? "" : undefined}
			className={cn("relative flex w-full items-center gap-2", className)}
			action=""
		>
			<div className="absolute left-5 flex items-center">
				{isPending ? (
					<Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
				) : (
					<Search className="text-muted-foreground h-4 w-4" />
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
				className="pl-12 truncate h-9 rounded-full"
				placeholder={placeholder || "Rechercher..."}
				aria-label="Champ de recherche"
			/>
			<Button
				className="absolute right-0 hover:bg-transparent"
				variant="ghost"
				onClick={clearSearch}
				aria-label="Effacer la recherche"
			>
				<X className="h-4 w-4 text-muted-foreground" />
			</Button>
		</Form>
	);
};

export function SearchFormSkeleton() {
	return <Skeleton className="h-10 w-full" />;
}

export default SearchForm;
