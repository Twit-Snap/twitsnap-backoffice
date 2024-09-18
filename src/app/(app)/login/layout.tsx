"use client";

import Image from "next/image";
import logo from "@/assets/icon.ico";
import styles from "@/styles/login/layout.module.css";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<header
				className={`${styles.banner} flex place-items-center `}
				role="banner">
				<Image src={logo} alt="TwitSnap logo" />
			</header>
			<main className={styles.login}>{children}</main>
		</div>
	);
}
