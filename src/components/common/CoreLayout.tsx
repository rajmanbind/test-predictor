"use client"

import { useAppState } from "@/hooks/useAppState"
import React from "react"

import { Loader } from "./Loader"
import { Toast } from "./Toast"

export function CoreLayout({ children }: { children: React.ReactNode }) {
  const { appState } = useAppState()

  return (
    <>
      <div
        className={appState?.overFlowYHidden ? "!fixed !overflow-y-hidden" : ""}
      >
        {children}
      </div>
      <Toast />
      <Loader />
    </>
  )
}
