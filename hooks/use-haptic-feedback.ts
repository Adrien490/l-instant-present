"use client";

import { useEffect, useState } from "react";

interface HapticOptions {
	light?: boolean; // Retour léger
	heavy?: boolean; // Retour fort
	success?: boolean; // Pattern de succès
	error?: boolean; // Pattern d'erreur
}

export function useHapticFeedback() {
	const [hasHaptics, setHasHaptics] = useState(false);

	useEffect(() => {
		// Vérifie si l'API est disponible
		if (typeof window !== "undefined" && "vibrate" in navigator) {
			setHasHaptics(true);
		}
	}, []);

	const trigger = (options: HapticOptions = {}) => {
		if (!hasHaptics) return;

		if (options.light) {
			navigator.vibrate(10); // Très court tap
		} else if (options.heavy) {
			navigator.vibrate(20); // Tap plus prononcé
		} else if (options.success) {
			navigator.vibrate([10, 30, 10]); // Double tap rapide
		} else if (options.error) {
			navigator.vibrate([40, 30, 40]); // Double tap plus long
		} else {
			navigator.vibrate(15); // Tap standard
		}
	};

	return { trigger, hasHaptics };
}
