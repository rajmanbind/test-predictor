"use client"

import { cn } from "@/utils/utils"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "../common/Button"
import { Logo } from "../common/Logo"
import { Container } from "./Container"
import { ThemeSwitcher } from "./ThemeSwitcher"

export const navbarMenus = [
  {
    title: "College Predictor",
    href: "/",
  },
  {
    title: "College Cut-Off",
    href: "/",
  },
]

export function NavbarItem({
  href,
  title,
  className,
}: {
  href: string
  title: string
  className?: string
}) {
  return (
    <Link href={href} className={cn("text-color-text", className)}>
      {title}
    </Link>
  )
}

export function Navbar() {
  const { theme } = useTheme()

  const pathname = usePathname()

  return (
    <Container>
      <div className="flex items-center justify-between h-[94px]">
        <div className="flex items-center tab:gap-16 gap-2">
          <Menu size={28} className="text-color-text pc:hidden" />

          <Logo
            className="gap-2 tab:gap-3"
            textStyle="text-color-text font-semibold text-[14px] pc:text-[20px]"
            imgStyle="size-[42px] pc:size-[62px]"
          />
          <nav className="hidden pc:flex gap-8">
            {navbarMenus.map((item) => (
              <NavbarItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <div className="pc:w-[400px] tab:w-[200px] w-[160px] h-[94px] flex items-center justify-between relative pc:px-8">
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 to-slate-800 skew-x-[-10deg] -z-10 hidden pc:block",
              theme === "dark" ? "opacity-0" : "opacity-100",
            )}
          ></div>
          <div>
            <ThemeSwitcher />
          </div>
          <Button className="text-[10px] tab:text-sm pc:text-base py-3">
            {pathname?.includes("admin") ? "Admin Panel" : "Sign in / Sign up"}
          </Button>
        </div>
      </div>
    </Container>
  )
}
