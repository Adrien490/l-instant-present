import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Plus, Users } from "lucide-react";
import Link from "next/link";

export default function Loading() {
	return (
		<PageContainer className="pb-20">
			{/* Hero Section */}
			<PageHeader
				title={<Skeleton className="h-5 w-full max-w-[500px]" />}
				description={<Skeleton className="h-5 w-full max-w-[500px]" />}
			/>

			{/* Quick Actions */}
			<div className="mt-4">
				<div className="grid grid-cols-2 gap-2">
					<Link href="/app/my-groups/new">
						<Card className="flex h-24 flex-col items-center justify-center gap-1.5 p-2">
							<div className="rounded-full bg-primary/10 p-2">
								<Plus className="h-5 w-5 text-primary" />
							</div>
							<span className="text-xs font-medium text-center">
								Créer un groupe
							</span>
						</Card>
					</Link>
					<Link href="/app/my-groups">
						<Card className="flex h-24 flex-col items-center justify-center gap-1.5 p-2">
							<div className="rounded-full bg-primary/10 p-2">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<span className="text-xs font-medium text-center">
								Mes groupes
							</span>
						</Card>
					</Link>
				</div>
			</div>

			{/* Pending Invites */}
			<div className="mt-6">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-semibold">Invitations en attente</h2>
				</div>
				<div className="mt-3 space-y-2">
					{[...Array(2)].map((_, i) => (
						<Card key={i} className="p-3">
							<div className="flex items-center gap-3">
								<div className="rounded-lg bg-primary/10 p-2">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-20" />
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* My Groups */}
			<div className="mt-6">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-semibold">Groupes récents</h2>
					<Button variant="ghost" size="sm" className="text-xs" asChild>
						<Link href="/app/my-groups">Voir tous mes groupes</Link>
					</Button>
				</div>
				<div className="mt-4 flex flex-col gap-2.5">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="p-4">
							<div className="flex items-center gap-4">
								<div className="rounded-xl bg-primary/10 p-3">
									<Users className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</PageContainer>
	);
}
