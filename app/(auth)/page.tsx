import PageContainer from "@/components/page-container";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import AuthCarousel from "./components/auth-carousel";
import SocialLogin from "./components/social-login";

export default function AuthPage() {
	return (
		<PageContainer className="min-h-screen flex flex-col items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
			<div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg space-y-10 md:space-y-12">
				{/* Logo et Présentation */}
				<div className="space-y-8 md:space-y-10 text-center">
					{/* Carousel */}
					<div className="relative w-full aspect-square max-w-[240px] md:max-w-[280px] mx-auto">
						<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/30 blur-2xl -z-10 opacity-70" />
						<AuthCarousel />
					</div>

					{/* Texte de présentation */}
					<div className="space-y-4">
						<div className="space-y-2">
							<h1
								className={cn(
									"text-3xl font-bold tracking-tight",
									"bg-gradient-to-r from-primary/90 to-primary",
									"bg-clip-text text-transparent",
									"md:text-4xl"
								)}
							>
								L&apos;instant présent
							</h1>
							<p className="text-lg font-medium leading-tight md:text-xl">
								Des défis, une année, des souvenirs pour la vie
							</p>
						</div>
						<p
							className={cn(
								"text-sm text-muted-foreground/90",
								"leading-relaxed max-w-[280px] mx-auto",
								"md:text-base md:max-w-[300px]"
							)}
						>
							Rejoignez vos amis et relevez ensemble des défis uniques pour
							créer des moments inoubliables.
						</p>
					</div>
				</div>

				{/* Connexion */}
				<div className="flex flex-col items-center space-y-1">
					<div className="relative w-full text-center">
						<Separator className="absolute inset-x-0 top-1/2 -translate-y-1/2" />
						<div className="relative inline-block bg-background px-4">
							<span
								className={cn(
									"text-xs font-medium tracking-wide uppercase",
									"text-muted-foreground/80"
								)}
							>
								Connexion
							</span>
						</div>
					</div>

					<div className="w-full">
						<SocialLogin />
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
