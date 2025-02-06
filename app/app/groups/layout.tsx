type Props = {
	params: Promise<{
		groupId: string;
	}>;
	children: React.ReactNode;
};

export default async function WithNavLayout({ children }: Props) {
	return <div className="flex flex-col h-full">{children}</div>;
}
