"use client"

import { cn } from "@/utils/utils"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { Button } from "../common/Button"
import { Logo } from "../common/Logo"
import { ThemeSwitcher } from "../frontend/ThemeSwitcher"
import { BE_Container } from "./BE_Container"

export function Navbar() {
  return (
    <div className="flex items-center justify-between bg-color-accent-dark px-8 py-3 fixed top-0 left-0 w-full">
      <div>
        <h2 className="text-[20px] text-white">
          College Predictor | Admin Panel
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Menu size={28} className="text-color-text pc:hidden" />

        <ThemeSwitcher />
        <Image
          className="rounded-full size-[40px]"
          src={"/logo.png"}
          width={60}
          height={60}
          alt="admin-dp"
        />
      </div>
    </div>
  )
}
