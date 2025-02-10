"use client"

import { cn } from "@/utils/utils"
import { useEffect, useState } from "react"

import { MobSidebar } from "./MobSidebar"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

export function BELayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div>
      <Navbar />
      <Sidebar className="hidden pc:block" />
      <MobSidebar />

      <main
        className={cn(
          "w-full p-4 tab:px-8 max-w-[1040px] mt-[80px] pc:ml-[240px] h-[calc(100vh-80px)]",
        )}
      >
        {children}
      </main>
    </div>
  )
}
