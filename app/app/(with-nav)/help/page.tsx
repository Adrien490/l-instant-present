import FAQ from "@/app/app/(with-nav)/help/components/faq";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import faqItems from "./lib/faq-items";

export default function HelpPage() {
	return (
		<PageContainer className="pb-24">
			<PageHeader
				title="Aide"
				description="Retrouvez les réponses aux questions fréquemment posées."
			/>
			<FAQ items={faqItems} className="mt-6" />
		</PageContainer>
	);
}
