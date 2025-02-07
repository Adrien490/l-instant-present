"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
	question: string;
	answer: string | React.ReactNode;
}

interface FAQProps {
	items: FAQItem[];
	className?: string;
}

export default function FAQ({ items, className }: FAQProps) {
	return (
		<Accordion type="single" collapsible className={className}>
			{items.map((item, index) => (
				<AccordionItem key={index} value={`item-${index + 1}`}>
					<AccordionTrigger className="text-left">
						{item.question}
					</AccordionTrigger>
					<AccordionContent>{item.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
