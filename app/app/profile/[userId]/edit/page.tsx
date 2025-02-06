import UserForm from "@/app/features/users/components/user-form";
import getUser from "@/app/features/users/queries/get-user";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { auth } from "@/lib/auth";
import { QueryStatus } from "@/types/query";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		userId: string;
	}>;
};

export default async function ProfileEditPage({ params }: Props) {
	const resolvedParams = await params;
	const { userId } = resolvedParams;
	const session = await auth.api.getSession({ headers: await headers() });

	const response = await getUser({ id: userId });

	if (response.status === QueryStatus.ERROR) {
		return notFound();
	}

	const user = response.data;

	if (!user || session?.user?.id !== user.id) {
		return notFound();
	}

	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Modifier mon profil"
				description="Modifier les informations de votre profil"
			/>
			<UserForm user={user} />
		</PageContainer>
	);
}
