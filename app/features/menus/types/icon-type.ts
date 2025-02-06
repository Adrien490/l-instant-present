import {
	Calendar,
	HelpCircle,
	Home,
	Info,
	Mail,
	Medal,
	PlusCircle,
	Trophy,
	Users2,
} from "lucide-react";
import NavItem from "./nav-item";

export type IconType =
	| "calendar"
	| "users"
	| "info"
	| "home"
	| "mail"
	| "help-circle"
	| "medal"
	| "trophy"
	| "plus-circle";

export const iconMap: Record<
	NavItem["iconType"],
	React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
	calendar: Calendar,
	users: Users2,
	info: Info,
	home: Home,
	mail: Mail,
	"help-circle": HelpCircle,
	medal: Medal,
	trophy: Trophy,
	"plus-circle": PlusCircle,
};
