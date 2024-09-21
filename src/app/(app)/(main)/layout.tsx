"use client";

import Image from "next/image";
import Link from "next/link";
import signup_light from "@/assets/signup_light.png";
import signup_dark from "@/assets/signup_dark.png";
import users_light from "@/assets/users_light.png";
import users_dark from "@/assets/users_dark.png";
import { redirect, usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { authenticatedAtom } from "../../../../types/authTypes";

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

	// if (!useAtomValue(authenticatedAtom)) {
	// 	redirect("/login");
	// }

	return (
		<div>
			<nav className="nav flex flex-col space-y-2">
				<Link
					href={"/signup"}
					className={`link ${isSelectedPage(pathname, "signup")}`}>
					<Image
						id="signup_logo"
						src={signup_dark}
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
						src={users_dark}
						alt="View all users logo"
						className="link_logo"
					/>
					<span>View all users</span>
				</Link>
			</nav>
			<main id="main_content">{children}</main>
		</div>
	);
}
