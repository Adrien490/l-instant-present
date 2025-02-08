import DeleteGroupForm from "@/app/features/groups/components/delete-group-form";
import isGroupAdmin from "@/app/features/groups/lib/is-group-admin";
import { getGroup } from "@/app/features/groups/queries/get-group";
import ImageCover from "@/components/image-cover";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		groupId: string;
	}>;
};

export default async function DeleteGroupPage({ params }: Props) {
	const resolvedParams = await params;
	const { groupId } = resolvedParams;

	const [group, isAdmin] = await Promise.all([
		getGroup({ id: groupId }),
		isGroupAdmin(groupId),
	]);

	if (!group || !isAdmin) {
		notFound();
	}

	return (
		<PageContainer className="pb-32">
			<PageHeader
				title="Supprimer un groupe"
				description="Êtes-vous sûr de vouloir supprimer ce groupe ?"
				showBackButton
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
