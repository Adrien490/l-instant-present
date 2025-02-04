export function getUserInitials(name?: string, email?: string): string {
	if (!name && !email) return "?";

	if (name) {
		const nameParts = name.split(" ");
		if (nameParts.length === 1) {
			return name.charAt(0).toUpperCase();
		}
		return (
			nameParts[0].charAt(0).toUpperCase() +
			nameParts[nameParts.length - 1].charAt(0).toUpperCase()
		);
	}

	if (email) {
		return email.charAt(0).toUpperCase();
	}

	return "?";
}

export function formatDateToFrench(date: Date): string {
	return new Intl.DateTimeFormat("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}
