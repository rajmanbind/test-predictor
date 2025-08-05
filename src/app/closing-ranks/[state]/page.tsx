"use client"

import { Button } from "@/components/common/Button"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { PaymentPopupCard } from "@/components/frontend/PaymentPopupCard"
import { PaymentRedirectPopup } from "@/components/frontend/PaymentRedirectPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { paymentType, priceType, years } from "@/utils/static"
import {
  cn,
  onPageChange,
  saveToLocalStorage,
  shouldRenderComponent,
} from "@/utils/utils"
import { ChevronLeft, CircleCheckBig, Eye, Users } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CollegeListClosingRanksPage() {
  const [tableData, setTableData] = useState<any>(null)

  const [updateUI, setUpdateUI] = useState(false)

  const [processingPayment, setProcessingPayment] = useState<any>(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [rowData, setRowData] = useState<any>(null)
  const [stateAmount, setStateAmount] = useState<number>(299)
  const [statePaymentPopup, setStatePaymentPopup] = useState(false)
  const [paymentChecker, setPaymentChecker] = useState(false)
  const [statePurchaseMode, setStatePurchaseMode] = useState(false)
 const currentYear = new Date().getFullYear()
 const prevYear  = currentYear-1
  const [configYear, setConfigYear] = useState<any>(null)

  const [amount, setAmount] = useState<number>(49)

  const params = useParams()


    const searchParams = useSearchParams()

  const courseType = searchParams.get("courseType")
  const course = searchParams.get("course")
  const stateCode = decodeURIComponent(params.state as any)
const state = searchParams.get("state")
// console.log(state)
  useEffect(() => {
    console.log("courseType:", courseType)
    console.log("course:", course)
    console.log("stateCode:", stateCode)
  }, [courseType, course])

  const { getSearchParams } = useInternalSearchParams()

  const { fetchData } = useFetch()

  const router = useRouter()

  const { showToast, setAppState } = useAppState()

  useEffect(() => {
    getData()
  }, [updateUI])

  async function getData() {
console.log("Lkasjdf;",courseType)

    const page = Number(getSearchParams("page") || 1)
    const [price, res,statePrice] = await Promise.all([
      fetchData({
        url: "/api/admin/configure_prices/get",
        params: {
          type:
            !courseType&&courseType?.includes("UG")
              ? priceType.SINGLE_COLLEGE_CLOSING_RANK_UG
              : priceType.SINGLE_COLLEGE_CLOSING_RANK_PG,
          item: state,
        },
      }),

fetchData({
      url: "/api/closing_ranks/college_list",
      params: {
        page,
        size: 20,
        state,
        courseType: courseType,
        course: course,
        stateCode:stateCode
      },
    })
,

      fetchData({
        url: "/api/admin/configure_prices/get",
        params: {
          type:
            !courseType&&courseType?.includes("UG")
              ? priceType.STATE_CLOSING_RANK_UG
              : priceType.STATE_CLOSING_RANK_PG,
          item: state,
        },
      }),
    ])

    // if (closingRankYear?.success) {
    //   setConfigYear({
    //     id: closingRankYear?.payload?.data?.[0]?.text,
    //     text: closingRankYear?.payload?.data?.[0]?.text,
    //   })
    // }
    if (price?.success) {
      setAmount(price?.payload?.data?.price)
    }

    if (statePrice?.success) {
      setStateAmount(statePrice?.payload?.data?.price)
    }


    // const res = await fetchData({
    //   url: "/api/closing_ranks/college_list",
    //   params: {
    //     page,
    //     size: 20,
    //     state,
    //     courseType: !courseType?"":courseType.toString()?.toUpperCase(), //ug pg
    //     course: course,
    //     stateCode:stateCode
    //   },
    // })

    
    if (res?.success) {
      console.log("ResP ",res.payload)
      setTableData(res?.payload)
    }
  }

  function buttonText(rowData: any) {
    return processingPayment === rowData?.id
      ? "Processing..."
      : `Unlock @ ₹${amount}`
  }

  function generateCols() {
    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
        disableMobStaticLeft: true,
      },
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      // { title: "State", tableKey: "state", width: "150px" },
      {
        title: "Course Type",
        tableKey: "courseType",

        width: "150px",
        renderer({ cellData }) {
          return courseType
        },
      },
      {
        title: "Unlock Cut-off",
        tableKey: "action",
        width: "120px",
        renderer({ rowData }) {
          return (
            <div className="w-[120px] m-3">
              {rowData?.purchased ? (
                <Link
                  href={`/closing-ranks/${stateCode}/college-details?state=${state}&college=${rowData?.instituteName}&courseType=${courseType}&course=${course}`}
                  className="text-[14px] disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => {
                    saveToLocalStorage(
                      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                      {
                        ...rowData,
                        course: course,
                        courseType: !courseType?"":courseType.toString()?.toUpperCase(),
                      },
                    )
                  }}
                >
                  <Button
                    className="py-2 px-2 text-[14px] w-fit disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center gap-1"
                    variant="primary"
                  >
                    <Eye size={20} /> View
                  </Button>
                </Link>
              ) : (
                <Button
                  className="py-2 px-2 text-[14px] w-fit disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed min-w-[100px] flex items-center gap-2"
                  variant="primary"
                  onClick={() => {
                    setPaymentChecker(true)

                    saveToLocalStorage(
                      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                      {
                        ...rowData,
                        course: course,
                        courseType: !courseType?"":courseType.toString()?.toUpperCase(),
                      },
                    )

                    setRowData(rowData)
                    handleBuyNow()
                  }}
                  disabled={processingPayment === rowData?.id}
                >
                  {buttonText(rowData)}
                </Button>
              )}
            </div>
          )
        },
      },
    ]

    return columns
  }

  async function handleBuyNow() {
    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      setProcessingPayment(rowData?.id)
      setShowPaymentPopup(true)
      setStatePurchaseMode(false)
    } else {
      setAppState({ signInModalOpen: true })
    }
  }

  async function successCallback(orderId: string) {
    setShowPaymentPopup(false)

    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    const payload = {
      orderId,
      amount,
      payment_type: paymentType?.SINGLE_COLLEGE_CLOSING_RANK,
      closing_rank_details: {
        ...rowData,
        courseType: courseType&&courseType?.includes("UG")? "UG" : "PG",
        course:course,
        year: configYear?.text,
      },
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })

    if (res?.success) {
      // setUpdateUI((prev) => !prev)

      const priceRes = await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [paymentType?.SINGLE_COLLEGE_CLOSING_RANK]: amount,
        },
        noToast: true,
      })

      if (priceRes?.success) {
        router.push(
          `/closing-ranks/${stateCode}/college-details?state=${state}&state=${state}&college=${rowData?.instituteName}&courseType=${courseType}&course=${course||""}`,
        )
      }
    }

    setProcessingPayment(false)
  }

  async function successCallbackStatePayment(orderId: string) {
    setShowPaymentPopup(false)

    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    const payload = {
      orderId,
      amount: stateAmount,
      payment_type: paymentType?.STATE_CLOSING_RANK,
      closing_rank_details: {
        state: state,
        courseType: courseType,
        course: course,
        // year: configYear?.text,
      },
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })

    if (res?.success) {
      const priceRes = await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [paymentType?.STATE_CLOSING_RANK]: stateAmount,
        },
        noToast: true,
      })

      if (priceRes?.success) {
        setStatePaymentPopup(false)
        setUpdateUI((prev) => !prev)
      }
    }

    setProcessingPayment(false)
  }

  function backURL() {
    return `/closing-ranks`
  }

  return (
    <FELayout>
      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            <Link
              href={backURL()}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All States
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-color-table-header">
                  {state} Medical Colleges
                </h1>
                <p className="text-gray-600">
                  NEET UG {prevYear} - {currentYear} <span className="capitalize">{state}</span>{" "}
                  Medical Colleges List
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            <div
              className={cn(
                "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
              )}
            >
              <p className="animated-new text-center">
                Rotate your Phone to Landscape or Horizontal For Better view.
              </p>
            </div>

            <Table
              columns={generateCols()}
              data={tableData?.data}
              itemsCountPerPage={tableData?.pageSize}
            />

            <Pagination
              currentPage={tableData?.currentPage}
              totalItems={tableData?.totalItems}
              itemsCountPerPage={tableData?.pageSize}
              wrapperClass="pb-[50px]"
              onPageChange={async (page: number) => {
                



 const res = await fetchData({
      url: "/api/closing_ranks/college_list",
      params: {
        page,
        size: 20,
        state,
        courseType: !courseType?"":courseType.toString()?.toUpperCase(),
        course: course,
        stateCode:stateCode
      },
    })

    
    if (res?.success) {
      // console.log("ResP ",res.payload)
      setTableData(res?.payload)
    }

              }}
            />
          </Container>
        </section>

        <div className="mt-[-100px] pb-16">
          {tableData?.data?.length > 0 &&
            !tableData?.data?.[0]?.statePurchased && (
              <section className="w-full">
                <Container className="container px-4 md:px-6">
                  {/* State Wise Purchase */}
                  <div className="mt-16 bg-gradient-to-r from-yellow-50 to-emerald-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 shadow-sm border border-green-200 mb-3 inline-block">
                        State-Wise Purchase
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-color-table-header">
                        {`Unlock All ${state}'s NEET ${course} Closing Ranks`}
                      </h3>
                      <p className="text-black">
                        You can unlock state-wise NEET {course} closing ranks for all
                        colleges in {state} at once.
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        fetchData({
                          url: "/api/user",
                          method: "GET",
                          noToast: true,
                        }).then((user) => {
                          if (user?.success) {
                            setStatePurchaseMode(true)
                            setStatePaymentPopup(true)
                          } else {
                            setAppState({ signInModalOpen: true })
                          }
                        })
                      }}
                      disabled
                      data-tooltip-id={"tooltip"}
                      data-tooltip-content="Coming Soon"
                    >
                      Unlock Now @ ₹{stateAmount}
                    </Button>
                  </div>
                </Container>
              </section>
            )}

          <section className="w-full">
            <Container className="container px-4 md:px-6">
              {/* Expert Guidance CTA */}
              <div className="mt-16 border border-color-accent rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black">
                    Need personalized guidance?
                  </h3>
                  <p className="text-gray-600">
                    Connect with our expert counselors to get personalized
                    college recommendations based on your NEET rank and
                    preferences.
                  </p>
                </div>
                <Link
                  href="https://wa.me/919028009835"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2 text-white"
                >
                  <Users className="h-5 w-5" />
                  Book Counselling Session
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </div>
      <SignInPopup
        successCallback={() => {
          setUpdateUI((prev) => !prev)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
      />

      <PaymentPopupCard
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onConfirm={() => setShowPaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for Closing Ranks"
        title={
          <p className="pt-2 uppercase poppinsFont">
            Please make payment to Unlock
          </p>
        }
        whatWillYouGet={
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />
              <h3 className="text-[15px] leading-[1.4]">
                {courseType?.includes("UG")
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

      <PaymentPopupCard
        isOpen={statePaymentPopup}
        onClose={() => setStatePaymentPopup(false)}
        onConfirm={() => setStatePaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for State Closing Ranks"
        title={
          <p className="pt-2 uppercase poppinsFont">
            {`Please make payment to Unlock All ${state}'s NEET ${course} Closing Ranks`}
          </p>
        }
        btnText={`Unlock Now @ ₹${stateAmount}`}
        whatWillYouGet={
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />
              <h3 className="text-[15px] leading-[1.4]">
                {`All Round's Complete Category and Quota Wise MBBS Cut-off RANK/
                MARKS Details (NEET UG 2024) of your Selected State.`}
              </h3>
            </li>
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="size-5 text-primary text-green-600 flex-shrink-0" />

              <h3 className="text-[15px]">Instant Access after Payment!</h3>
            </li>
          </ul>
        }
        amount={stateAmount}
      />

      {paymentChecker && (
        <PaymentRedirectPopup
          successCallback={
            statePurchaseMode ? successCallbackStatePayment : successCallback
          }
        />
      )}
    </FELayout>
  )
}

