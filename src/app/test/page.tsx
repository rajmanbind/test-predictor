"use client"

import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"

import PaymentCard from "../[id]/cutoff/PaymentCard"

function page() {
  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10">
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            Test Page...
          </h2>

          <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
        </div>

        <PaymentCard
          successCallback={() => {
            console.log("success")
            alert("success")
          }}
          amount={1}
          paymentDescription="Payment for Single College Cutoff at CollegeCutoff.net"
          title={
            <p className="uppercase poppinsFont">Please Make Test Payment</p>
          }
          btnText={`Unlock Cut-Off Now @ ₹1`}
        />
      </Container>
    </FELayout>
  )
}
export default page

