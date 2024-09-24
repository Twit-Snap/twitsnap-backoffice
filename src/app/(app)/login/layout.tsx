"use client";

import Image from "next/image";
import logo from "@/assets/icon.ico";
import styles from "@/styles/login/layout.module.css";
import { authenticatedAtom } from "@/types/authTypes";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [auth, setAuth] = useAtom(authenticatedAtom);

	useEffect(() => {
		if (!auth) {
			const session: string | null = localStorage.getItem("auth");
			if (session) {
				setAuth(JSON.parse(session));
				redirect("/signup");
			}
		}
	}, [auth, setAuth]);

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
