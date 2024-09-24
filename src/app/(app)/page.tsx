"use client";

import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { authenticatedAtom } from "@/types/authTypes";
import { useEffect } from "react";

export default function GoHome() {
	const [auth, setAuth] = useAtom(authenticatedAtom);

	useEffect(() => {
		if (!auth) {
			const session: string | null = localStorage.getItem("auth");
			if (!session) {
				redirect("/login");
			}
			setAuth(JSON.parse(session));
			redirect("/signup");
		}
	}, [auth, setAuth]);
}
