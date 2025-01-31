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
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileActions() {
	const router = useRouter();

	const onLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	return (
		<div className="rounded-lg border bg-card">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						className="w-full justify-start rounded-none h-auto py-4 px-6 hover:bg-muted"
					>
						<LogOut className="w-4 h-4 mr-3" />
						<span>Déconnexion</span>
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
					<AlertDialogHeader className="p-6 pb-4">
						<AlertDialogTitle className="text-xl">
							Voulez-vous vraiment vous déconnecter ?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-base">
							Vous devrez vous reconnecter pour accéder à votre compte.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-0">
						<AlertDialogCancel className="mt-0 w-full sm:w-auto">
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction onClick={onLogout} className="w-full sm:w-auto">
							Se déconnecter
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
