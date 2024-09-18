"use client"

import Image from "next/image"
import twitsnap_light from "@/assets/logo_light.png"
import twitsnap_dark from "@/assets/logo_dark.png"
import { useTheme } from "next-themes"
import ThemeSwitcher from "@/components/theme_switcher"
import { useEffect, useState } from "react"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [mounted, setMounted] = useState(false);
    
    // Avoid Hydration Mismatch
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return null;
    }

    const { resolvedTheme } = useTheme();
    
    return (
        <div>
            <header className="title">
                <div className="flex flex-row">
                    <Image
                        id="twitsnap_logo"
                        src={resolvedTheme === "dark" ? twitsnap_dark : twitsnap_light}
                        alt="Twitsnap logo"
                    />
                    <span>Back Office</span>
                </div>
                <ThemeSwitcher />
            </header>
            <main>{children}</main>
        </div>
    )
}