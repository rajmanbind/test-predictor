"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import Script from "next/script"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

import FloatingWhatsAppButton from "./FloatingWhatsAppButton"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { ScrollToTopButton } from "./ScrollToTopButton"

export function FELayout({ children }: { children: React.ReactNode }) {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)

  const { fetchData } = useFetch()
  const { setAppState } = useAppState()

  async function getCurrentUser() {
    const res = await fetchData({
      url: "/api/user",
      noToast: true,
      noLoading: true,
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
    <main className="min-h-screen flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Navbar />

      <div className="flex-grow">{children}</div>

      <FloatingWhatsAppButton />

      <Footer />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />

      <ScrollToTopButton />
    </main>
  )
}

