"use client"

import { cn } from "@/utils/utils"
import { useEffect, useState } from "react"

import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

export function BE_Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main
        className={cn(
          "w-full p-4 tab:px-8 max-w-[1040px] mt-[80px] pc:ml-[240px] pc:h-[calc(100vh-80px)]",
        )}
      >
        {children}
      </main>
    </div>
  )
}
