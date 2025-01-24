"use client"

import { useAppState } from "@/hooks/useAppState"
import { cn } from "@/utils/utils"

export function Loader() {
  const { appState } = useAppState()

  if (!appState.isLoading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
      <div className=" bg-color-modal-background flex flex-col gap-6 items-center text-center px-10 py-6 rounded-md">
        <div className={cn("loader")}></div>
        <h2 className="text-[20px] text-color-text">Loading Please wait..</h2>
      </div>
    </div>
  )
}
