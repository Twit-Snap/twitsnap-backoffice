"use client"

import Image from "next/image"
import Link from "next/link"
import signup_light from "@/assets/signup_light.png"
import signup_dark from "@/assets/signup_dark.png"
import users_light from "@/assets/users_light.png"
import users_dark from "@/assets/users_dark.png"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

const isSelectedPage = (path: string, expected: string, theme: string | undefined) => {
    if (path.split('/')[1] !== expected) {
        return "";
    }

    if (!theme) {
        return "bg-[rgb(110,110,110)] pointer-events-none"
    }

    return theme === "dark" ? "bg-[rgb(110,110,110)] pointer-events-none" : "bg-[rgb(150,150,150)] pointer-events-none"
}

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { resolvedTheme } = useTheme();
    const pathname = usePathname()

    return (
        <div>
            <nav className="nav flex flex-col space-y-2">
                <Link href={"/signup"} className={`link ${isSelectedPage(pathname, "signup", resolvedTheme)}`}>
                    <Image
                        id="signup_logo"
                        src={resolvedTheme === "dark" ? signup_dark : signup_light}
                        alt="Sign Up an admin logo"
                        className="link_logo"
                    />
                    <span>Sign up an admin</span>
                </Link>
                <Link href={"/users"} className={`link ${isSelectedPage(pathname, "users", resolvedTheme)}`}>
                    <Image
                        id="users_logo"
                        src={resolvedTheme === "dark" ? users_dark : users_light}
                        alt="View all users logo"
                        className="link_logo"
                    />
                    <span>View all users</span>
                </Link>
            </nav>
            <main id="main_content">{children}</main>
        </div>
    )
}