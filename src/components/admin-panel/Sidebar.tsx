"use client"

import { cn } from "@/utils/utils"
import { Database, Home, PlusSquare, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export const sidebarMenus = [
  {
    icon: <Home />,
    title: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    icon: <Users />,
    title: "Users",
    link: "/admin/users",
  },
  {
    icon: <PlusSquare />,
    title: "Add Data",
    link: "/admin/add-data",
  },
  {
    icon: <Database />,
    title: "Manage Data",
    link: "/admin/manage-data",
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed top-[64px] h-screen pc:h-[calc(100vh-3px)] overflow-y-auto overflow-x-hidden bg-color-form-background w-[240px]",
        className,
      )}
    >
      <ul className="mt-6">
        {sidebarMenus.map((menu, index) => (
          <Link
            key={menu?.title}
            href={menu.link}
            className={cn(
              "flex items-center gap-2 py-3 px-4 hover:bg-color-accent hover:text-white",
              pathname === menu.link && "bg-color-accent-dark text-white",
            )}
          >
            <span>{menu.icon}</span>
            <span>{menu.title}</span>
          </Link>
        ))}
      </ul>
    </div>
  )
}
