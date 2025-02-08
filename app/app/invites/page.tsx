import GroupInviteList from "@/app/features/group-invites/components/group-invite-list";
import getGroupInviteList from "@/app/features/group-invites/queries/get-group-invite-list";
import FloatingButton from "@/components/floating-button";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Mail, Plus, Send } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	searchParams: Promise<{ search?: string; filter?: "received" | "sent" }>;
};

export default async function InvitesPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { search, filter = "received" } = resolvedSearchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user.id) {
		return null;
	}

	return (
		<PageContainer className="pb-20">
			<PageHeader
				title="Invitations"
				description="Gérer vos invitations"
				showBackButton
				className="mb-4 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			/>

			<div className="flex flex-col gap-5">
				{/* Tabs Navigation */}
				<Tabs defaultValue={filter} className="w-full">
					<TabsList className="w-full h-12 p-1 bg-muted/50 rounded-full grid grid-cols-3 gap-1">
						<TabsTrigger
							value="received"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link
								replace
								href={{
									query: {
										...resolvedSearchParams,
										filter: "received",
									},
								}}
							>
								<Mail className="h-4 w-4 mr-2" />
								Reçues
							</Link>
						</TabsTrigger>
						<TabsTrigger
							value="sent"
							className="rounded-full data-[state=active]:bg-background"
							asChild
						>
							<Link
								replace
								href={{
									query: {
										...resolvedSearchParams,
										filter: "sent",
									},
								}}
							>
								<Send className="h-4 w-4 mr-2" />
								Envoyées
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Search Bar - Sticky on scroll */}
				<div className="sticky top-[72px] z-30 backdrop-blur py-2 -mx-4 px-4 bg-background/95">
					<div className="flex gap-3 items-center">
						<SearchForm
							paramName="search"
							placeholder="Rechercher une invitation"
						/>
						<Button
							asChild
							size="icon"
							variant="secondary"
							className="h-11 w-11 rounded-full shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
						>
							<Link href="/app/invites/send">
								<Plus className="h-5 w-5" />
								<span className="sr-only">Envoyer une invitation</span>
							</Link>
						</Button>
					</div>
				</div>

				{/* Quick Stats Cards */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex gap-3 items-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50">
						<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
							<Mail className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Reçues
							</p>
							<p className="text-2xl font-bold">3</p>
						</div>
					</div>

					<div className="flex gap-3 items-center p-4 rounded-2xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-border/50">
						<div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
							<Send className="h-5 w-5 text-secondary-foreground" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Envoyées
							</p>
							<p className="text-2xl font-bold">5</p>
						</div>
					</div>
				</div>

				{/* Invites List */}
				<section className="space-y-4 mt-2">
					<Suspense key={`${filter}-${search}`} fallback={<></>}>
						<GroupInviteList
							filter={filter}
							getGroupInviteListPromise={getGroupInviteList({
								search,
								filter,
							})}
							className="grid gap-3"
						/>
					</Suspense>
				</section>

				{/* FAB - Send Invite */}
				<FloatingButton
					href="/app/invites/send"
					label="Nouvelle invitation"
					variant="primary"
				>
					<Plus className="h-6 w-6" />
				</FloatingButton>
			</div>
		</PageContainer>
	);
}
