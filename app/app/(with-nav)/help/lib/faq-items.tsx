const faqItems = [
	// Groupes
	{
		question: "Comment créer un groupe ?",
		answer:
			"Pour créer un groupe, cliquez sur le bouton « Créer un groupe » depuis la page d'accueil. Donnez un nom à votre groupe et ajoutez une description optionnelle.",
	},
	{
		question: "Quels sont les différents rôles dans un groupe ?",
		answer:
			"Il existe deux rôles : ADMIN et MEMBER. Les administrateurs peuvent gérer le groupe, inviter des membres et créer des périodes de jeu. Les membres peuvent participer aux défis.",
	},
	{
		question: "Comment inviter des membres ?",
		answer:
			"En tant qu'administrateur, vous pouvez inviter des membres en saisissant leur adresse email. L'invitation reste valide jusqu'à son acceptation ou son expiration.",
	},

	// Périodes et Défis
	{
		question: "Comment fonctionnent les périodes de jeu ?",
		answer:
			"Une période de jeu (ChallengePeriod) est un intervalle de temps pendant lequel des défis sont disponibles. Chaque période a une date de début et de fin, et peut être active ou inactive.",
	},
	{
		question: "Quels sont les niveaux de difficulté des défis ?",
		answer:
			"Les défis sont classés en 4 niveaux de difficulté : EASY (facile), MEDIUM (moyen), HARD (difficile) et EXPERT. Chaque niveau rapporte un nombre différent de points.",
	},

	// Validations et Complétion
	{
		question: "Comment valider un défi ?",
		answer:
			"Pour valider un défi, vous devez soumettre une preuve de réalisation. Les autres membres peuvent ensuite voter pour valider ou non votre complétion avec un commentaire optionnel.",
	},
	{
		question: "Comment fonctionne le système de validation ?",
		answer:
			"Chaque complétion nécessite un certain nombre de votes positifs pour être validée. Les membres peuvent voter positivement ou négativement, et ajouter un commentaire pour justifier leur choix.",
	},

	// Notifications
	{
		question: "Quels types de notifications puis-je recevoir ?",
		answer:
			"Vous pouvez recevoir des notifications pour : les invitations de groupe (GROUP_INVITE), les défis complétés (CHALLENGE_COMPLETED), les validations reçues (VALIDATION_RECEIVED), le début d'une période (PERIOD_STARTED) et l'arrivée d'un nouveau membre (MEMBER_JOINED).",
	},
	{
		question: "Comment activer les notifications push ?",
		answer:
			"Vous pouvez activer les notifications push en autorisant les notifications dans votre navigateur. Vous recevrez alors des alertes même lorsque l'application est fermée.",
	},

	// Compte et Sécurité
	{
		question: "Comment gérer mes sessions actives ?",
		answer:
			"Vous pouvez voir et gérer vos sessions actives dans les paramètres de votre compte. Chaque session inclut des informations sur l'appareil et la localisation.",
	},
	{
		question: "Comment quitter un groupe ?",
		answer:
			"Vous pouvez quitter un groupe depuis ses paramètres. Si vous êtes le dernier administrateur, vous devrez d'abord nommer un autre administrateur avant de pouvoir quitter le groupe.",
	},
];

export default faqItems;
