"use client"

import { useLink } from "@/hooks/useLink"
import { cn } from "@/utils/utils"
import React from "react"

export default function Link({
  href,
  children,
  className,
  params,
  options,
  onClick,
}: {
  href: string
  children: React.ReactNode
  className?: string
  params?: Record<string, string>
  options?: any
  onClick?: () => void
}) {
  const navigation = useLink()

  return (
    <button
      type="button"
      className={cn("block", className)}
      onClick={() => {
        onClick?.()
        navigation(href, params, options)
      }}
    >
      {children}
    </button>
  )
}
