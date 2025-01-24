"use client"

import { useEffect, useState } from "react"

import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

export function FE_Layout({ children }: { children: React.ReactNode }) {
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
