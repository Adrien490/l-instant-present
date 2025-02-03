import DeleteGroupForm from "@/app/entities/groups/components/delete-group-form";
import { getGroup } from "@/app/entities/groups/queries/get-group";
import { isGroupAdmin } from "@/app/entities/groups/queries/is-group-admin";
import EmptyState from "@/components/empty-state";
import ImageCover from "@/components/image-cover";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DeleteGroupPageProps {
	params: Promise<{
		groupId: string;
	}>;
	searchParams: Promise<{
		deleted?: string;
	}>;
}

function DeletedGroupState() {
	return (
		<PageContainer>
			<EmptyState
				icon={
					<CheckCircle2 className="h-5 w-5 text-emerald-500 transform-gpu" />
				}
				title="Groupe supprimé"
				description="Le groupe a été supprimé avec succès."
				action={
					<Button
						variant="outline"
						size="lg"
						className="w-full touch-target-2025 min-h-[44px] font-medium text-base leading-normal antialiased"
						asChild
					>
						<Link href="/app/my-groups">
							<ArrowLeft className="mr-3 h-5 w-5 transform-gpu" />
							Retourner à mes groupes
						</Link>
					</Button>
				}
				className="min-h-[60vh] spacing-2025-compact"
			/>
		</PageContainer>
	);
}

function GroupNotFoundState() {
	return (
		<PageContainer>
			<EmptyState
				icon={
					<AlertTriangle className="h-5 w-5 text-muted-foreground transform-gpu" />
				}
				title="Groupe introuvable"
				description="Ce groupe a peut-être été supprimé ou n'existe pas."
				action={
					<Button
						variant="outline"
						size="lg"
						className="w-full touch-target-2025 min-h-[44px] font-medium text-base leading-normal antialiased"
						asChild
					>
						<Link href="/app/my-groups">
							<ArrowLeft className="mr-3 h-5 w-5 transform-gpu" />
							Retourner à mes groupes
						</Link>
					</Button>
				}
				className="min-h-[60vh] spacing-2025-compact"
			/>
		</PageContainer>
	);
}

export default async function DeleteGroupPage({
	params,
	searchParams,
}: DeleteGroupPageProps) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const { groupId } = resolvedParams;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/signin");
	}

	if (resolvedSearchParams.deleted === "true") {
		return <DeletedGroupState />;
	}

	const [group, isAdmin] = await Promise.all([
		getGroup({ id: groupId }),
		isGroupAdmin(groupId),
	]);

	if (!group) {
		return <GroupNotFoundState />;
	}

	if (!isAdmin) {
		redirect("/app/my-groups");
	}

	return (
		<PageContainer className="pb-32 safe-area-bottom">
			<PageHeader
				title="Supprimer un groupe"
				description="Êtes-vous sûr de vouloir supprimer ce groupe ?"
			/>
			<div className="max-w-2xl mx-auto space-y-8">
				<div className="relative rounded-2xl overflow-hidden bg-muted">
					<ImageCover imageUrl={group.imageUrl} alt={group.name}>
						<div className="absolute bottom-0 left-0 right-0 p-6">
							<h1 className="text-2xl font-medium leading-tight tracking-tight md:tracking-normal text-white antialiased">
								{group.name}
							</h1>
							{group.description && (
								<p className="mt-2 text-base leading-normal antialiased text-white/90 line-clamp-2">
									{group.description}
								</p>
							)}
						</div>
					</ImageCover>
				</div>
				<DeleteGroupForm group={group} />
			</div>
		</PageContainer>
	);
}
