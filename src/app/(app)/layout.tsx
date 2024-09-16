import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo_light.png"
import signup_logo from "@/assets/signup_light.png"
import users_logo from "@/assets/users_light.png"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <header className="sidebar_menu bg-white text-black flex flex-col" role="banner">
                <h1 className="title">
                    <Image
                        id="twitsnap_logo"
                        src={logo}
                        alt="Twitsnap logo"
                    />
                    <span>Back office</span>
                </h1>
                <nav className="flex flex-col w-full">
                    <Link href={"/signup"} className="link">
                        <Image
                            id="signup_logo"
                            src={signup_logo}
                            alt="Sign Up an admin logo"
                            className="link_logo"
                        />
                        <span className="text-black">Sign up an admin</span>
                    </Link>
                    <Link href={"/users"} className="link">
                        <Image
                            id="users_logo"
                            src={users_logo}
                            alt="View all users logo"
                            className="link_logo"
                        />
                        <span className="text-black">View all users</span>
                    </Link>
                </nav>
            </header>
            <main id="main_content">{children}</main>
        </div>
    )
}