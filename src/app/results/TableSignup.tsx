import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { PaymentPopupCard } from "@/components/frontend/PaymentPopupCard"
import { PaymentRedirectPopup } from "@/components/frontend/PaymentRedirectPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { paymentType } from "@/utils/static"
import { getPhoneFromUser } from "@/utils/utils"
import { ChevronRight, CircleCheckBig } from "lucide-react"
import { SetStateAction, useState } from "react"

interface TableSignupProps {
  totalRecords: number
  setUpdateUI: React.Dispatch<SetStateAction<boolean>>
  amount: number
  configYear?: any
  params?: any
}

function TableSignup({
  totalRecords,
  setUpdateUI,
  amount,
  configYear,
  params,
}: TableSignupProps) {
  const { getSearchParams } = useInternalSearchParams()

  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const { setAppState } = useAppState()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()

  if (totalRecords <= 10) {
    return null
  }

  async function successCallback(orderId: string) {
    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    setShowPaymentPopup(false)

    const payload: any = {
      orderId,
      amount,
      payment_type: paymentType?.RANK_COLLEGE_PREDICTOR,

      college_predictor_details: {
        rank: getSearchParams("rank")?.trim(),
        course: getSearchParams("course")?.trim(),
        year: `${configYear[0]}-${configYear[1]}`,
      },
    }

    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      payload.phone = getPhoneFromUser(user)
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })

    if (res?.success) {
      setUpdateUI((prev) => !prev)

      await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [paymentType?.RANK_COLLEGE_PREDICTOR]: amount,
        },
        noLoading: true,
        noToast: true,
      })
    }
  }

  async function handleBuyNow() {
    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      setShowPaymentPopup(true)
    } else {
      setAppState({ signInModalOpen: true })
    }
  }

  return (
    <div className="h-52 bg-[#ecbc00] translate-y-[-20px] rounded-md">
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
            disabled={showPaymentPopup}
            onClick={handleBuyNow}
          >
            <div className="flex items-center gap-2">
              Unlock @ ₹{amount} <ChevronRight />
            </div>
          </button>
        </div>
      </div>

      <SignInPopup
        successCallback={() => {
          setShowPaymentPopup(true)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        noRedirect
      />

      <PaymentPopupCard
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onConfirm={() => setShowPaymentPopup(false)}
        paymentDescription="Payment for College Predictor at CollegeCutoff.net"
        title={
          <p className="pt-2 uppercase poppinsFont">
            Please Make Payment To View All Options
          </p>
        }
        whatWillYouGet={
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />
              <h3 className="text-[15px] leading-[1.4]">
                {params === "UG"
                  ? "All Round's Complete Category and Quota Wise MBBS Cut-off RANK/MARKS Details (NEET UG 2024) of your Selected College."
                  : "Access All Round's MD/MS/Diploma Cut-off Rank / Percentile Details (NEET PG 2024) – Specialization, Category & Quota Wise for Your Selected College."}
              </h3>
            </li>

            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />
              <h3 className="text-[15px]">Instant Access after Payment!</h3>
            </li>
          </ul>
        }
        btnText={`Unlock Now @ ₹${amount}`}
        amount={amount}
      />

      <PaymentRedirectPopup successCallback={successCallback} />
    </div>
  )
}

export default TableSignup

