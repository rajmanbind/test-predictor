"use client"

import { useAppState } from "@/hooks/useAppState"
import { cn } from "@/utils/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { sidebarMenus } from "./Sidebar"

export function MobSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const { appState, setAppState } = useAppState()

  return (
    <>
      <div
        className="absolute top-0 left-0 inset-0 bg-black bg-opacity-50 z-[1000]"
        style={{
          display: appState.isSidebarOpen ? "block" : "none",
        }}
        onClick={() => {
          setAppState({ isSidebarOpen: false })
        }}
      ></div>

      <div
        className={cn(
          "absolute left-0 top-0 h-screen overflow-y-auto overflow-x-hidden bg-color-form-background w-[240px] z-[1001] transition-transform  duration-500",
          appState?.isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]",
          className,
        )}
      >
        <ul className="mt-6">
          {sidebarMenus?.map((menu) => (
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
    </>
  )
}
