"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export interface ThemeToggleResult {
	icon: typeof Moon | typeof Sun;
	label: string;
	onClick: () => void;
	isDark: boolean;
}

export function ThemeToggle(): ThemeToggleResult {
	const { setTheme, theme, systemTheme } = useTheme();

	const isDark =
		theme === "dark" || (theme === "system" && systemTheme === "dark");

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return {
		icon: isDark ? Moon : Sun,
		label: `Passer en mode ${isDark ? "clair" : "sombre"}`,
		onClick: toggleTheme,
		isDark,
	};
}
