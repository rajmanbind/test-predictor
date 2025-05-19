import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { ClosingRanksPage } from "@/components/frontend/ClosingRanksPage"
import { FELayout } from "@/components/frontend/FELayout"
import React from "react"

export default function ClosingRanks() {
  return (
    <FELayout>
      <ClosingRanksPage />
      <SignInPopup />
    </FELayout>
  )
}

