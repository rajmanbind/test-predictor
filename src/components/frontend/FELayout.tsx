"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

import FloatingWhatsAppButton from "./FloatingWhatsAppButton"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

export function FELayout({ children }: { children: React.ReactNode }) {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)

  const { fetchData } = useFetch()
  const { setAppState } = useAppState()

  async function getCurrentUser() {
    const res = await fetchData({
      url: "/api/user",
    })

    if (res?.success) {
      setAppState({ user: res?.payload?.user })
    } else {
      setAppState({ user: null })
    }
  }

  useEffect(() => {
    setIsThemeLoaded(true)
    getCurrentUser()
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

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </main>
  )
}
