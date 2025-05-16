import { useAppState } from "@/hooks/useAppState"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { saveToLocalStorage } from "@/utils/utils"
import { ChevronRight } from "lucide-react"
import { SetStateAction, useState } from "react"
import { isMobile } from "react-device-detect"

interface TableSignupProps {
  totalRecords: number
  setUpdateUI: React.Dispatch<SetStateAction<boolean>>
}

function TableSignup({ totalRecords, setUpdateUI }: TableSignupProps) {
  const [processingPayment, setProcessingPayment] = useState(false)

  const { getSearchParams } = useInternalSearchParams()

  const { showToast } = useAppState()

  if (totalRecords <= 10) {
    return null
  }

  const createOrder = async (amount: number) => {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error("Failed to create order")
    return data.orderId
  }

  const processPayment = async (amount: number) => {
    try {
      const orderId = await createOrder(amount)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "College CutOff",
        description: "CollegeCutOff.net Payment for Closing Ranks",
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

              saveToLocalStorage(
                `payment-predictor-${getSearchParams("rank")}`,
                true,
              )

              setUpdateUI((prev) => !prev)
            } else {
              showToast("error", "Payment verification failed!")
            }

            setProcessingPayment(false)
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
            setProcessingPayment(false)
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
        modal: {
          ondismiss: function () {
            showToast("error", "Payment was cancelled by user.")
            setProcessingPayment(false)
          },
        },
        // Add callback for failed payments
        "payment.failed": function (response: any) {
          console.error("Payment failed:", response)
          showToast("error", `Payment failed: ${response.error.description}`)
          setProcessingPayment(false)
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        showToast("error", `Payment failed: ${response.error.description}`)
        setProcessingPayment(false)
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
      setProcessingPayment(false)
    }
  }

  return (
    <div className="h-52 bg-[#ecbc00] sticky left-0">
      <div className="h-full w-full grid place-items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-white text-center flex flex-col gap-2 justify-center items-center">
          <h2 className="text-[26px] font-medium">
            +{totalRecords} More Options
          </h2>

          <p className="text-lg">
            {`Get access to over +${totalRecords} more colleges, courses,
            fees, cut-offs, and much more.`}
          </p>

          <button
            className="flex items-center gap-2 bg-black px-3 pl-5 py-3 mt-4 hover:bg-black/90 hover:border-white border-[2px] disabled:bg-black/50 border-transparent box-border transition-all rounded-md"
            disabled={processingPayment}
            onClick={() => {
              setProcessingPayment(true)
              processPayment(149)
            }}
          >
            {processingPayment ? (
              `Processing...`
            ) : (
              <div className="flex items-center gap-2">
                Unlock @ ₹149 <ChevronRight />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableSignup

