"use client";

import Image from "next/image";
import logo from "@/assets/icon.ico";
import { useEffect, useState } from "react";
import styles from "@/styles/login/layout.module.css";
import { themedStyleClass } from "@/utils/utils";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	// Avoid Hydration Mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div>
			<header
				className={`${themedStyleClass(styles, "banner")} flex place-items-center `}
				role="banner"
			>
				<Image src={logo} alt="TwitSnap logo" />
			</header>
			<main className={themedStyleClass(styles, "login")}>
				{children}
			</main>
		</div>
	);
}
