"use client"

import { useEffect, useState } from "react"

import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

export function FELayout({ children }: { children: React.ReactNode }) {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)

  useEffect(() => {
    setIsThemeLoaded(true)
  }, [])

  if (!isThemeLoaded) {
    return null
  }

  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
