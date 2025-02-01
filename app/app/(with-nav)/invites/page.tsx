import { getGroupInvites } from "@/app/entities/group-invites/queries/get-group-invites";
import getGroups from "@/app/entities/groups/queries/get-groups";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Send } from "lucide-react";
import Link from "next/link";
import InviteList from "./components/invite-list";

type Props = {
	searchParams: Promise<{ type?: "received" | "sent" }>;
};

export default async function InvitesPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const type = resolvedSearchParams.type;
	const defaultType = type === "sent" ? "sent" : "received";
	const [invites, groups] = await Promise.all([
		getGroupInvites({ type: defaultType }),
		getGroups({ search: "" }),
	]);

	return (
		<PageContainer className="pb-24">
			<PageHeader
				title="Invitations"
				description="Gérez vos invitations aux groupes"
			/>

			{groups.length > 0 && (
				<div className="mt-4">
					<Button asChild>
						<Link href="/app/invites/send">
							<Plus className="h-4 w-4 mr-2" />
							Envoyer une invitation
						</Link>
					</Button>
				</div>
			)}

			<Tabs defaultValue={defaultType} className="mt-6">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="received" className="flex items-center gap-2">
						<Mail className="h-4 w-4" />
						Reçues{" "}
						{invites.length > 0 && (
							<Badge variant="secondary" className="ml-1.5">
								{invites.length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="sent" className="flex items-center gap-2">
						<Send className="h-4 w-4" />
						Envoyées{" "}
						{invites.length > 0 && (
							<Badge variant="secondary" className="ml-1.5">
								{invites.length}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="received">
					<InviteList invites={invites} type="received" />
				</TabsContent>

				<TabsContent value="sent">
					<InviteList invites={invites} type="sent" />
				</TabsContent>
			</Tabs>
		</PageContainer>
	);
}
