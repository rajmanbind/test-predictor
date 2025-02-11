"use client"

import { useAppState } from "@/hooks/useAppState"
import React from "react"

import { Loader } from "./Loader"
import { ToastProvider } from "./ToastProvider"

export function CoreLayout({ children }: { children: React.ReactNode }) {
  const { appState } = useAppState()

  return (
    <>
      <div
        className={appState?.overFlowYHidden ? "!fixed !overflow-y-hidden" : ""}
      >
        {children}
      </div>
      <ToastProvider />
      <Loader />
    </>
  )
}
