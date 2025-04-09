import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { closingRanksStates } from "@/utils/static"
import Link from "next/link"
import React from "react"

export default function ClosingRanks() {
  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10">
        <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 order-2 pc:order-1 pt-4">
          Closing Ranks
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 gap-y-8">
          {closingRanksStates?.map((state) => (
            <div key={state?.text}>
              <h2 className="text-color-accent font-medium text-base mb-1">
                {state?.text}
              </h2>

              <Link
                href={"#"}
                className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
              >
                {state?.text} - UG Medical
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </FELayout>
  )
}
