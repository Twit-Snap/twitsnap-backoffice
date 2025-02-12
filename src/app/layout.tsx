import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import "@/styles/main_layout/layout.css";
import "@/styles/constants.css";
import { Provider } from "jotai";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Back office / TwitSnap",
	description: "TwitSnap Back Office",
	icons: {
		icon: [
			{
				url: "../assets/icon.ico",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	//Suprimo warnings, recomendacion de la doc de next-themes. Dura una capa
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
