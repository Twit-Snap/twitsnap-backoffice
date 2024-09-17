import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import "@/styles/input_username.css"
import "@/styles/main_layout/layout.css"
import "@/styles/main_layout/switch_button.css"
import ThemeProvider from "@/utils/theme_provider";
import Head from "next/head";

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
				url: "../assets/icon.ico"
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
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
