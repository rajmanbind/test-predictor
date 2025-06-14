"use client"

import { Button } from "@/components/common/Button"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { PaymentPopupCard } from "@/components/frontend/PaymentPopupCard"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { paymentType, priceType, years } from "@/utils/static"
import { cn, onPageChange, saveToLocalStorage } from "@/utils/utils"
import {
  ChevronLeft,
  CircleCheckBig,
  Eye,
  Info,
  Users,
  View,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Script from "next/script"
import { useEffect, useState } from "react"

const yearList: IOption[] = []
const configYearList = years()

for (let i = 0; i < configYearList?.length; i++) {
  if (new Date().getFullYear() >= parseInt(configYearList?.[i]?.text)) {
    yearList.push(configYearList?.[i])
  }
}

export default function CollegeListClosingRanksPage() {
  const [tableData, setTableData] = useState<any>(null)

  const [updateUI, setUpdateUI] = useState(false)

  const [processingPayment, setProcessingPayment] = useState<any>(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [rowData, setRowData] = useState<any>(null)
  const [stateAmount, setStateAmount] = useState<number>(299)
  const [statePaymentPopup, setStatePaymentPopup] = useState(false)
  const [statePurchaseMode, setStatePurchaseMode] = useState(false)

  const [selectedClosingRankYear, setSelectedClosingRankYear] = useState<
    IOption | undefined
  >()
  const [defaultClosingRankValue, setDefaultClosingRankValue] = useState<
    IOption | undefined
  >()

  const [amount, setAmount] = useState<number>(49)

  const params = useParams()
  const state = decodeURIComponent(params.state as any)
  const { getSearchParams } = useInternalSearchParams()

  const { fetchData } = useFetch()

  const router = useRouter()

  const { showToast, setAppState } = useAppState()

  useEffect(() => {
    getData()
  }, [updateUI])

  async function getData() {
    const [closingRankYear, price, statePrice] = await Promise.all([
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CLOSING_RANK_YEAR" },
      }),
      fetchData({
        url: "/api/admin/configure_prices/get",
        params: {
          type:
            params.id === "ug"
              ? priceType.SINGLE_COLLEGE_CLOSING_RANK_UG
              : priceType.SINGLE_COLLEGE_CLOSING_RANK_PG,
          item: state,
        },
      }),
      fetchData({
        url: "/api/admin/configure_prices/get",
        params: {
          type:
            params.id === "ug"
              ? priceType.STATE_CLOSING_RANK_UG
              : priceType.STATE_CLOSING_RANK_PG,
          item: state,
        },
      }),
    ])

    if (closingRankYear?.success) {
      setDefaultClosingRankValue({
        id: closingRankYear?.payload?.data?.[0]?.id,
        text: closingRankYear?.payload?.data?.[0]?.text,
      })
    }

    if (price?.success) {
      setAmount(price?.payload?.data?.price)
    }

    if (statePrice?.success) {
      setStateAmount(statePrice?.payload?.data?.price)
    }

    const page = Number(getSearchParams("page") || 1)

    const res = await fetchData({
      url: "/api/closing_ranks/college_list",
      params: {
        page,
        size: 20,
        state,
        courseType: params.id?.toString()?.toUpperCase(), //ug pg
        course: getSearchParams("course"),
        year:
          selectedClosingRankYear?.text ||
          closingRankYear?.payload?.data?.[0]?.text,
      },
    })

    if (res?.success) {
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
      { title: "State", tableKey: "state", width: "150px" },
      {
        title: "Course Type",
        tableKey: "courseType",

        width: "150px",
        renderer({ cellData }) {
          return getSearchParams("course")
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
                  href={`/closing-ranks/${params?.id}/${state}/college-details?college=${rowData?.instituteName}&course=${getSearchParams(
                    "course",
                  )}`}
                  className="text-[14px] disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => {
                    saveToLocalStorage(
                      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                      {
                        ...rowData,
                        course: getSearchParams("course"),
                        courseType: params.id?.toString()?.toUpperCase(),
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
                    if (rowData?.purchased) return
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
        courseType: params?.id === "ug" ? "UG" : "PG",
        course: getSearchParams("course"),
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
          `/closing-ranks/${params?.id}/${state}/college-details?college=${rowData?.instituteName}&course=${getSearchParams("course")}`,
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
        state: params?.state,
        courseType: params?.id === "ug" ? "UG" : "PG",
        course: getSearchParams("course"),
        year: defaultClosingRankValue?.text,
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
    return `/closing-ranks/${params.id}?course=${getSearchParams("course")}`
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
                  NEET {params?.id?.toString()?.toUpperCase()}{" "}
                  {selectedClosingRankYear?.text}{" "}
                  <span className="capitalize">{state}</span> Medical Colleges
                  List
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
              onPageChange={(page: number) => {
                onPageChange(
                  page,
                  "/api/closing_ranks",
                  fetchData,
                  setTableData,
                  {
                    size: 20,
                    state,
                    year: selectedClosingRankYear?.text,
                  },
                )
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
                        {`Unlock All ${params?.state}'s NEET ${getSearchParams("course")} Closing Ranks`}
                      </h3>
                      <p className="text-black">
                        You can unlock state-wise NEET{" "}
                        {getSearchParams("course")} closing ranks for all
                        colleges in {params?.state} at once.
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setStatePurchaseMode(true)

                        fetchData({
                          url: "/api/user",
                          method: "GET",
                          noToast: true,
                        }).then((user) => {
                          if (user?.success) {
                            setStatePaymentPopup(true)
                          } else {
                            setAppState({ signInModalOpen: true })
                          }
                        })
                      }}
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
        successCallback={successCallback}
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for Closing Ranks"
        title={
          <p className="pt-2 uppercase poppinsFont">
            Please make payment to Unlock
          </p>
        }
        btnText={`Unlock Now @ ₹${amount}`}
        amount={amount}
      />

      <PaymentPopupCard
        successCallback={successCallbackStatePayment}
        isOpen={statePaymentPopup}
        onClose={() => setStatePaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for State Closing Ranks"
        title={
          <p className="pt-2 uppercase poppinsFont">
            {`Please make payment to Unlock All ${params?.state}'s NEET ${getSearchParams("course")} Closing Ranks`}
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
    </FELayout>
  )
}

