import DeleteGroupForm from "@/app/entities/groups/components/delete-group-form";
import { getGroup } from "@/app/entities/groups/queries/get-group";
import { isGroupAdmin } from "@/app/entities/groups/queries/is-group-admin";
import EmptyState from "@/components/empty-state";
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
				icon={<CheckCircle2 className="h-8 w-8 text-emerald-500" />}
				title="Groupe supprimé"
				description="Le groupe a été supprimé avec succès."
				action={
					<Button variant="outline" size="lg" className="w-full" asChild>
						<Link href="/app/my-groups">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Retourner à mes groupes
						</Link>
					</Button>
				}
				className="min-h-[60vh]"
			/>
		</PageContainer>
	);
}

function GroupNotFoundState() {
	return (
		<PageContainer>
			<EmptyState
				icon={<AlertTriangle className="h-8 w-8 text-muted-foreground" />}
				title="Groupe introuvable"
				description="Ce groupe a peut-être été supprimé ou n'existe pas."
				action={
					<Button variant="outline" size="lg" className="w-full" asChild>
						<Link href="/app/my-groups">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Retourner à mes groupes
						</Link>
					</Button>
				}
				className="min-h-[60vh]"
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
		<PageContainer className="pb-32">
			<PageHeader
				title="Supprimer un groupe"
				description="Êtes-vous sûr de vouloir supprimer ce groupe ?"
			/>
			<DeleteGroupForm group={group} />
		</PageContainer>
	);
}
