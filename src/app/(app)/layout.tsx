"use client"

import Image from "next/image"
import twitsnap_light from "@/assets/logo_light.png"
import twitsnap_dark from "@/assets/logo_dark.png"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid Hydration Mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <header className="title">
                <div className="flex flex-row">
                    <Image
                        id="twitsnap_logo"
                        src={theme === "dark" ? twitsnap_dark : twitsnap_light}
                        alt="Twitsnap logo"
                    />
                    <span>Back Office</span>
                </div>
                <label className="switch">
                    <input type="checkbox" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
                    <span className="slider round display:block" />
                </label>
            </header>
            <main>{children}</main>
        </div>
    )
}