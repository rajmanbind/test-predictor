import PaymentButton from "@/components/frontend/PaymentButton"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { Shield } from "lucide-react"
import React from "react"

const PRICE = 49

function PaymentCard({ showCutoff }: { showCutoff: () => void }) {
  const { getSearchParams } = useInternalSearchParams()

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-[#fff] dark:bg-[#000] shadow-xl">
      {/* Header with gradient background */}
      <div className="bg-color-accent p-6 text-white">
        <h1 className="text-center text-xl font-bold leading-tight text-white">
          Please make payment to view Cut-Off of:
          <br />
          {getSearchParams("college")}
        </h1>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="mb-8 rounded-lg bg-[#b3b3b3]/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Amount to pay
              </p>
              <p className="text-3xl font-bold text-primary">₹{PRICE}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <h3 className="font-medium">{`What you'll get:`}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
              Complete cut-off details for your selected college
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
              Instant access after payment
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
              Lifetime access
            </li>
          </ul>
        </div>

        <PaymentButton amount={PRICE} showCutoff={showCutoff} />

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secured by <span className="font-bold">Razorpay</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentCard
