import EmptyPlaceholder from "@/components/empty-placeholder";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GroupNotFound() {
	return (
		<PageContainer className="min-h-[60vh] flex items-center justify-center">
			<EmptyPlaceholder
				icon={
					<AlertTriangle className="h-5 w-5 text-muted-foreground transform-gpu" />
				}
				title="Groupe introuvable"
				description="Ce groupe a peut-être été supprimé ou n'existe pas."
				action={
					<Button
						variant="outline"
						size="lg"
						className="w-full min-h-[44px] font-medium text-base leading-normal antialiased"
						asChild
					>
						<Link href="/app/my-groups">
							<ArrowLeft className="mr-3 h-5 w-5 transform-gpu" />
							Retourner à mes groupes
						</Link>
					</Button>
				}
			/>
		</PageContainer>
	);
}
