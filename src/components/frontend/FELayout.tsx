"use client"

import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

import { SignInPopup } from "../common/popups/SignInPopup"
import FloatingWhatsAppButton from "./FloatingWhatsAppButton"
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

      <FloatingWhatsAppButton />

      <Footer />

      <SignInPopup />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </main>
  )
}
