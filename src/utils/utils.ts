import { useTheme } from "next-themes";

export function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export function themedStyleClass(styles: any, def: string) {
	const { resolvedTheme } = useTheme();
	return `${styles[def]} ${resolvedTheme === "dark" ? styles["dark"] : ""}`;
}
