"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
	children: React.ReactNode;
};

export default function LogoutButton({ children }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						startTransition(() => {
							router.push("/");
						});
					},
				},
			});
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
			setIsOpen(false);
		}
	};

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(open) => !isPending && setIsOpen(open)}
		>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Êtes-vous sûr de vouloir vous déconnecter ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Vous devrez vous reconnecter pour accéder à votre compte.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleLogout} disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Déconnexion...
							</>
						) : (
							"Se déconnecter"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
