import ProfileSettings from "@/app/features/users/components/profile-settings";
import getUser from "@/app/features/users/queries/get-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		userId: string;
	}>;
};

export default async function ProfilePage({ params }: Props) {
	const resolvedParams = await params;
	const { userId } = resolvedParams;

	const user = await getUser({ id: userId });
	const session = await auth.api.getSession({ headers: await headers() });

	if (!user) {
		return notFound();
	}

	const isCurrentUser = session?.user?.id === user.id;

	return <>{isCurrentUser ? <ProfileSettings /> : <></>}</>;
}
