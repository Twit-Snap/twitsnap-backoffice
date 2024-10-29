"use client";

import Image from "next/image";
import Link from "next/link";
import signup_logo from "@/assets/signup_dark.png";
import users_logo from "@/assets/users_dark.png";
import twit_logo from "@/assets/twit_logo.png";
import { redirect, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { authenticatedAtom } from "@/types/authTypes";
import { useEffect } from "react";

const isSelectedPage = (path: string, expected: string) => {
	if (path.split("/")[1] !== expected) {
		return "";
	}

	return "bg-[rgb(110,110,110)]";
};

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const [auth, setAuth] = useAtom(authenticatedAtom);

	useEffect(() => {
		if (!auth) {
			const session: string | null = localStorage.getItem("auth");
			if (!session) {
				redirect("/login");
			}
			setAuth(JSON.parse(session));
		}
	}, [auth, setAuth]);

	return (
		<div>
			<nav className="nav flex flex-col space-y-2">
				<Link
					href={"/signup"}
					className={`link ${isSelectedPage(pathname, "signup")}`}>
					<Image
						id="signup_logo"
						src={signup_logo}
						alt="Sign Up an admin logo"
						className="link_logo"
					/>
					<span>Sign up an admin</span>
				</Link>
				<Link	
					href={"/users"}
					className={`link ${isSelectedPage(pathname, "users")}`}>
					<Image
						id="users_logo"
						src={users_logo}
						alt="View all users logo"
						className="link_logo"
					/>
					<span>View all users</span>
				</Link>
				<Link
					href={"/twits"}
					className={`link ${isSelectedPage(pathname, "twits")}`}>
					<Image
						id="twit_logo"
						src={twit_logo}
						alt="View all twits logo"
						className="link_logo"
					/>
					<span>View all twits</span>
				</Link>
			</nav>
			<main id="main_content">{children}</main>
		</div>
	);
}
