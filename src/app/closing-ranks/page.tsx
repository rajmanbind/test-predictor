import { ClosingRanksPage } from "@/components/frontend/ClosingRanksPage"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { closingRanksStates } from "@/utils/static"
import Link from "next/link"
import React from "react"

export default function ClosingRanks() {
  return (
    <FELayout>
      <ClosingRanksPage />
    </FELayout>
  )
}
