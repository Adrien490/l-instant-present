import PageContainer from "@/components/page-container";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import SocialLogin from "./components/social-login";

export default function AuthPage() {
	return (
		<PageContainer className="flex flex-col items-center justify-center py-12">
			<div className="space-y-12 text-center w-full max-w-[340px] mx-auto">
				<div className="space-y-10">
					<div className="relative w-44 h-44 mx-auto">
						<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-primary/50 animate-pulse duration-3000" />
						<div className="absolute inset-[4px] rounded-full bg-gradient-to-b from-background to-background/80 backdrop-blur-sm" />
						<Image
							src="https://cqh6s9vs06.ufs.sh/f/exr347yFLlRD6yXGfoGZzRFBAPYa3w9SqMxDvNIb5hjpWcf0"
							alt="L'instant présent"
							fill
							priority
							className="object-contain p-5 rounded-full drop-shadow-md"
						/>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
								L&apos;instant présent
							</h1>
							<p className="text-lg font-medium leading-tight">
								Des défis, une année, des souvenirs pour la vie
							</p>
						</div>
						<p className="text-sm text-muted-foreground/90 leading-relaxed max-w-[280px] mx-auto">
							Rejoignez vos amis et relevez ensemble des défis uniques pour
							créer des moments inoubliables.
						</p>
					</div>
				</div>

				<div className="space-y-6">
					<div className="relative">
						<Separator className="absolute inset-x-0 top-1/2 -translate-y-1/2" />
						<div className="relative inline-block bg-background px-4">
							<span className="text-xs font-medium text-muted-foreground/80 tracking-wide uppercase">
								Connexion
							</span>
						</div>
					</div>

					<SocialLogin />
				</div>
			</div>
		</PageContainer>
	);
}
