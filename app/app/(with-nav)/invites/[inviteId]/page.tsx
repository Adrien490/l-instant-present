import { getGroupInvite } from "@/app/entities/group-invites/queries/get-group-invite";
import ImageCover from "@/components/image-cover";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { GroupInviteStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Check, Mail, Users, X } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		inviteId: string;
	}>;
};

export default async function InvitePage({ params }: Props) {
	const resolvedParams = await params;
	const { inviteId } = resolvedParams;
	const session = await auth.api.getSession({ headers: await headers() });

	const invite = await getGroupInvite({ inviteId });

	if (!invite) {
		return notFound();
	}

	const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
	const isPending = invite.status === GroupInviteStatus.PENDING;
	const isAccepted = invite.status === GroupInviteStatus.ACCEPTED;
	const isRejected = invite.status === GroupInviteStatus.REJECTED;
	const isReceived = invite.email === session?.user.email;
	const isSender = invite.senderId === session?.user.id;

	// Si l'utilisateur n'est ni l'expéditeur ni le destinataire, on le redirige
	if (!isReceived && !isSender) {
		notFound();
	}

	return (
		<PageContainer className="pb-32">
			<div className="flex flex-col">
				<div className="relative">
					<ImageCover imageUrl={invite.group.imageUrl} alt={invite.group.name}>
						<div className="absolute bottom-0 left-0 right-0 p-4">
							<div className="flex flex-col gap-4">
								<h2 className="text-lg font-medium leading-tight tracking-tight md:tracking-normal flex items-center gap-3 text-white antialiased">
									{invite.group.name}
								</h2>
								<div className="flex items-center gap-2 flex-wrap">
									<time className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white">
										{formatDistanceToNow(new Date(invite.createdAt), {
											addSuffix: true,
											locale: fr,
										})}
									</time>
									<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white">
										{invite.group.members.length} membre
										{invite.group.members.length > 1 ? "s" : ""}
									</div>
									{isExpired ? (
										<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-destructive/80 backdrop-blur-sm text-white">
											Expirée
										</div>
									) : (
										<>
											{isPending && (
												<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-white">
													En attente
												</div>
											)}
											{isAccepted && (
												<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-emerald-500/80 backdrop-blur-sm text-white">
													Acceptée
												</div>
											)}
											{isRejected && (
												<div className="text-sm leading-normal antialiased px-2 py-1 rounded-full bg-destructive/80 backdrop-blur-sm text-white">
													Refusée
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</ImageCover>
				</div>

				<div className="py-4 space-y-4">
					<p className="text-base leading-normal md:leading-relaxed antialiased text-muted-foreground">
						{invite.group.description}
					</p>

					<div className="bg-muted rounded-xl overflow-hidden">
						<div className="p-4 space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-base font-medium leading-tight tracking-tight md:tracking-normal antialiased flex items-center gap-2">
									<Users className="h-5 w-5 text-primary transform-gpu" />
									Membres du groupe
								</h3>
							</div>

							{invite.group.members.length > 0 && (
								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{invite.group.members.map((member) => (
											<UserAvatar
												key={member.userId}
												user={{
													id: member.userId,
													name: member.user.name,
													image: member.user.image,
												}}
												className="group relative touch-target-2025"
											/>
										))}
									</div>
									<div className="text-sm leading-normal antialiased text-muted-foreground">
										<div className="line-clamp-2">
											{invite.group.members.map((m) => m.user.name).join(", ")}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="bg-muted rounded-xl overflow-hidden">
						<div className="p-4 space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-base font-medium leading-tight tracking-tight md:tracking-normal antialiased flex items-center gap-2">
									<Mail className="h-5 w-5 text-primary transform-gpu" />
									Détails de l&apos;invitation
								</h3>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<div
										className="h-10 w-10 rounded-full ring-2 ring-background transition-transform hover:scale-105 transform-gpu"
										style={{
											backgroundImage: `url(${invite.sender.image})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									/>
									<div>
										<p className="text-sm font-medium leading-normal antialiased">
											{invite.sender.name}
										</p>
										<p className="text-sm leading-normal antialiased text-muted-foreground">
											{invite.sender.email}
										</p>
									</div>
								</div>
								<p className="text-sm leading-normal antialiased text-muted-foreground">
									{isSender ? (
										<>Invitation envoyée à {invite.email}</>
									) : (
										<>Invitation reçue sur {invite.email}</>
									)}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-4 pb-32 safe-area-bottom">
						{isReceived && isPending && !isExpired && (
							<>
								<Button
									size="lg"
									className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
									asChild
								>
									<Link href={`/app/invites/${invite.id}/accept`}>
										<Check className="mr-3 h-5 w-5 transform-gpu" />
										Accepter l&apos;invitation
									</Link>
								</Button>

								<Button
									variant="destructive"
									size="lg"
									className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
									asChild
								>
									<Link href={`/app/invites/${invite.id}/reject`}>
										<X className="mr-3 h-5 w-5 transform-gpu" />
										Refuser l&apos;invitation
									</Link>
								</Button>
							</>
						)}

						{isAccepted && (
							<Button
								size="lg"
								className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
								asChild
							>
								<Link href={`/app/groups/${invite.group.id}`}>
									<ArrowRight className="mr-3 h-5 w-5 transform-gpu" />
									Accéder au groupe
								</Link>
							</Button>
						)}

						{isSender && isPending && !isExpired && (
							<Button
								variant="destructive"
								size="lg"
								className="w-full justify-start font-medium text-base leading-normal antialiased touch-target-2025 min-h-[44px] px-4"
								asChild
							>
								<Link href={`/app/invites/${invite.id}/cancel`}>
									<X className="mr-3 h-5 w-5 transform-gpu" />
									Annuler l&apos;invitation
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
