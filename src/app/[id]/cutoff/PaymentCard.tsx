"use client"

import { Button } from "@/components/common/Button"
import { useAppState } from "@/hooks/useAppState"
import { cn } from "@/utils/utils"
import { ArrowRight, CircleCheckBig, Shield } from "lucide-react"
import React, { ReactNode, useState } from "react"
import { isMobile } from "react-device-detect"

interface IPaymentCardProps {
  successCallback?: (orderId: string) => void
  errorCallback?: (orderId: string) => void
  whatWillYouGet?: ReactNode
  amount: number
  title: ReactNode
  paymentDescription: string
  btnText: string
}

function PaymentCard({
  successCallback,
  errorCallback,
  whatWillYouGet,
  amount,
  title,
  paymentDescription,
  btnText,
}: IPaymentCardProps) {
  const [loading, setLoading] = useState(false)

  const { showToast } = useAppState()

  const createOrder = async () => {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error("Failed to create order")
    return data.orderId
  }

  const processPayment = async () => {
    setLoading(true)
    try {
      const orderId = await createOrder()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "College Cutoff",
        description: paymentDescription,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyResponse.json()

            if (verifyData.isOk) {
              successCallback?.(orderId)
            } else {
              showToast("error", "Payment verification failed!")
              errorCallback?.(orderId)
            }
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
            errorCallback?.(orderId)
          }
        },
        theme: {
          color: "#E67817",
        },
        method: {
          upi: isMobile ? true : false,
          card: true,
          netbanking: true,
          wallet: true,
        },
        // Add callback for failed payments
        "payment.failed": function (response: any) {
          console.error("Payment failed:", response)
          showToast("error", `Payment failed: ${response.error.description}`)
          errorCallback?.(orderId)
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        showToast("error", `Payment failed: ${response.error.description}`)
        errorCallback?.(orderId)
      })
      paymentObject.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      errorCallback?.(error.message)

      showToast(
        "error",
        <p>
          Internal Server Error <br /> Please try again.
        </p>,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full pc:max-w-[380px] max-w-[350px] overflow-hidden rounded-xl bg-[#fff] dark:bg-[#000] shadow-xl">
      <div className="bg-[#0054A4] p-6 text-white">
        <h1 className="text-center text-xl font-bold leading-tight text-white">
          {title}
        </h1>
      </div>

      <div
        className={cn("p-6", isMobile && "landscape:h-[240px] overflow-y-auto")}
      >
        <div className="mb-8 rounded-lg bg-[#b3b3b3]/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Amount to pay
              </p>
              <p className="text-3xl font-bold text-primary">₹{amount}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <h3 className="font-medium text-[20px]">{`What You'll Get :`}</h3>

          {whatWillYouGet ? (
            whatWillYouGet
          ) : (
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex font-poppins gap-2">
                <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />
                <h3 className="text-[15px] leading-[1.4]">
                  {`All Round's Complete Category and Quota Wise MBBS Cut-off RANK/
                MARKS Details (NEET UG 2024) of your Selected College.`}
                </h3>
              </li>
              <li className="flex font-poppins gap-2">
                <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />

                <h3 className="text-[15px]">Instant Access after Payment!</h3>
              </li>
            </ul>
          )}
        </div>

        <Button
          className="w-full text-lg font-medium flex items-center justify-center"
          onClick={processPayment}
          disabled={loading}
        >
          <span className="mr-2">{loading ? "Processing..." : btnText}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secured by <span className="font-bold">Razorpay</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentCard

