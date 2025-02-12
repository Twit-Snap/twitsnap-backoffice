"use client";

import Image from "next/image";
import twitsnap_dark from "@/assets/logo_dark.png";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<header className="title">
				<div className="flex flex-row">
					<Image
						id="twitsnap_logo"
						src={twitsnap_dark}
						alt="Twitsnap logo"
					/>
					<span>Back Office</span>
				</div>
			</header>
			<main>{children}</main>
		</div>
	);
}
