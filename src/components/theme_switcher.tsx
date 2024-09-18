import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<label className="switch">
			<input
				type="checkbox"
				onClick={() =>
					setTheme(resolvedTheme === "dark" ? "light" : "dark")
				}
			/>
			<span className="slider round" />
		</label>
	);
}
