"use client"

import Image from "next/image"
import Link from "next/link"
import twitsnap_light from "@/assets/logo_light.png"
import twitsnap_dark from "@/assets/logo_dark.png"
import signup_light from "@/assets/signup_light.png"
import signup_dark from "@/assets/signup_dark.png"
import users_light from "@/assets/users_light.png"
import users_dark from "@/assets/users_dark.png"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const pageName = (path: string) => {
    switch (path.split('/')[1]) {
        case "home":
            return "Home"

        case "signup":
            return "Sign up an admin"

        case "users":
            return "View all users"

        default:
            return ""
    }
}



export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname()

    // Avoid Hydration Mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <header className="sidebar_menu flex flex-col" role="banner">
                <h1 className="title">
                    <div className="flex flex-row">
                        <Image
                            id="twitsnap_logo"
                            src={theme === "dark" ? twitsnap_dark : twitsnap_light}
                            alt="Twitsnap logo"
                        />
                        <span>Back office</span>
                    </div>
                    <label className="w-6/12 whitespace-nowrap truncate text-2xl">{pageName(pathname)}</label>
                    <label className="switch">
                        <input type="checkbox" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
                        <span className="slider round display:block" />
                    </label>
                </h1>
                <nav className="nav flex flex-col w-full">
                    <Link href={"/signup"} className="link">
                        <Image
                            id="signup_logo"
                            src={theme === "dark" ? signup_dark : signup_light}
                            alt="Sign Up an admin logo"
                            className="link_logo"
                        />
                        <span>Sign up an admin</span>
                    </Link>
                    <Link href={"/users"} className="link">
                        <Image
                            id="users_logo"
                            src={theme === "dark" ? users_dark : users_light}
                            alt="View all users logo"
                            className="link_logo"
                        />
                        <span>View all users</span>
                    </Link>
                </nav>
            </header>
            <main id="main_content">{children}</main>
        </div>
    )
}