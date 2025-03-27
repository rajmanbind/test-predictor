"use client"

import { useAppState } from "@/hooks/useAppState"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { saveToLocalStorage } from "@/utils/utils"
import { ArrowRight } from "lucide-react"
import Script from "next/script"
import { useState } from "react"

import { Button } from "../common/Button"

const PaymentButton = ({
  amount,
  showCutoff,
}: {
  amount: number
  showCutoff: () => void
}) => {
  const [loading, setLoading] = useState(false)

  const { showToast } = useAppState()

  const { getSearchParams } = useInternalSearchParams()

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
        name: "Career Edwise",
        description: "Test Transaction",
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
              showToast(
                "success",
                <p>
                  Payment Successful
                  <br />
                  Thank You for purchasing!
                </p>,
              )

              let college = getSearchParams("college")

              if (college) {
                college = college.toLowerCase().trim().split(" ").join("-")
                saveToLocalStorage(`payment-${college}`, true)
              }

              showCutoff()
            } else {
              showToast("error", "Payment verification failed!")
            }
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        // Add callback for failed payments
        "payment.failed": function (response: any) {
          console.error("Payment failed:", response)
          showToast("error", `Payment failed: ${response.error.description}`)
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        showToast("error", `Payment failed: ${response.error.description}`)
      })
      paymentObject.open()
    } catch (error) {
      console.error("Payment error:", error)
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Button
        className="w-full text-lg font-medium flex items-center justify-center"
        onClick={processPayment}
        disabled={loading}
      >
        <span className="mr-2">
          {loading ? "Processing..." : `Pay ₹${amount} Now`}
        </span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </>
  )
}

export default PaymentButton
