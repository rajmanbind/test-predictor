"use client"

import { Button } from "@/components/common/Button"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { years } from "@/utils/static"
import { autoComplete, onPageChange } from "@/utils/utils"
import { ChevronLeft, Info, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Script from "next/script"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const yearList: IOption[] = []
const configYearList = years()

for (let i = 0; i < configYearList?.length; i++) {
  if (new Date().getFullYear() >= parseInt(configYearList?.[i]?.text)) {
    yearList.push(configYearList?.[i])
  }
}

export default function StateClosingRanksPage() {
  const [tableData, setTableData] = useState<any>(null)

  const [currentAmount, setCurrentAmount] = useState(0)
  const [currentRow, setCurrentRow] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)

  const [selectedClosingRankYear, setSelectedClosingRankYear] = useState<
    IOption | undefined
  >()
  const [defaultClosingRankValue, setDefaultClosingRankValue] = useState<
    IOption | undefined
  >()

  const params = useParams()
  const state = decodeURIComponent(params.id as any)
  const { getSearchParams } = useInternalSearchParams()

  const { fetchData } = useFetch()

  const { showToast, appState, setAppState } = useAppState()

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    getData()
  }, [updateUI])

  async function getData() {
    const closingRankYear = await fetchData({
      url: "/api/admin/configure/get",
      params: { type: "CLOSING_RANK_YEAR" },
    })

    if (closingRankYear?.success) {
      setDefaultClosingRankValue({
        id: closingRankYear?.payload?.data?.[0]?.id,
        text: closingRankYear?.payload?.data?.[0]?.text,
      })
    }

    const page = Number(getSearchParams("page") || 1)

    const res = await fetchData({
      url: "/api/closing_ranks",
      params: {
        page,
        size: 20,
        state,
        year:
          selectedClosingRankYear?.text ||
          closingRankYear?.payload?.data?.[0]?.text,
      },
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  function generateCols() {
    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
      },
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      { title: "State", tableKey: "state", width: "150px" },
      { title: "Course", tableKey: "course" },
      { title: "Quota", tableKey: "quota", width: "150px" },
      {
        title: (
          <div>
            Allotted
            <br />
            Category
          </div>
        ),
        tableKey: "category",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${selectedClosingRankYear?.text} Round 1`}
          >
            CR {selectedClosingRankYear?.text} [R1]
          </div>
        ),
        tableKey: `closingRankR1`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${selectedClosingRankYear?.text} Round 2`}
          >
            CR {selectedClosingRankYear?.text} [R2]
          </div>
        ),
        tableKey: `closingRankR2`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${selectedClosingRankYear?.text} Round 3`}
          >
            CR {selectedClosingRankYear?.text} [R3]
          </div>
        ),
        tableKey: `closingRankR3`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round ${selectedClosingRankYear?.text}`}
          >
            SR {selectedClosingRankYear?.text}
          </div>
        ),
        tableKey: `strayRound`,
        width: "110px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Last Stray Round ${selectedClosingRankYear?.text}`}
          >
            Last <br />
            SR {selectedClosingRankYear?.text}
          </div>
        ),
        tableKey: `lastStrayRound`,
        width: "110px",
      },
      { title: "Fees", tableKey: "fees", width: "100px" },
      {
        title: "Buy Now",
        tableKey: "action",
        width: "100px",
        renderer({ rowData }) {
          return (
            <div className="flex justify-center w-full">
              <Button
                className="py-2 px-2 text-[14px] w-fit"
                variant="primary"
                onClick={() => handleBuyNow(rowData, 49)}
              >
                Unlock ₹49
              </Button>
            </div>
          )
        },
      },
    ]

    return columns
  }

  async function handleBuyNow(rowData: any, amount: number) {
    setCurrentRow(rowData)
    setCurrentAmount(amount)

    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      processPayment(rowData, amount)
    } else {
      setAppState({ signInModalOpen: true })
    }
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

  const processPayment = async (rowData?: any, amount?: number) => {
    try {
      const orderId = await createOrder(amount || currentAmount)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: currentAmount * 100, // Amount in paise
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

            console.log("Verification response:", verifyData)

            if (verifyData.isOk) {
              showToast(
                "success",
                <p>
                  Payment Successful
                  <br />
                  Thank You for purchasing!
                </p>,
              )

              const phone_no = "+91-7903924731"

              const value = []
              const id = rowData?.id || currentRow?.id

              if (id) {
                value.push(id)
              }

              const payload = {
                phone_no,
                value,
                type: "college",
              }

              const res = await fetchData({
                url: "/api/purchase/plans_or_colleges",
                method: "POST",
                data: payload,
              })

              if (res?.success) {
                setUpdateUI((prev) => !prev)
              }
            } else {
              showToast("error", "Payment verification failed!")
            }
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
          }
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
    }
  }

  return (
    <FELayout>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            <Link
              href="/closing-ranks"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All States
            </Link>

            <SearchAndSelect
              name="closingRankYear"
              placeholder="Select Year"
              value={selectedClosingRankYear}
              defaultOption={defaultClosingRankValue}
              onChange={({ selectedValue }) => {
                setSelectedClosingRankYear(selectedValue)
                setUpdateUI((prev) => !prev)
              }}
              control={control}
              setValue={setValue}
              options={yearList}
              debounceDelay={0}
              searchAPI={(text, setOptions) =>
                autoComplete(text, yearList, setOptions)
              }
              wrapperClass="max-w-[150px]"
              errors={errors}
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-black">
                  {state} Medical Colleges
                </h1>
                <p className="text-gray-600">
                  NEET UG 2024 Closing Ranks for Medical Colleges
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Closing ranks are based on the 2024
                  NEET counselling data. These ranks represent the last rank at
                  which a candidate was admitted to the college in the
                  respective category. Actual cutoffs may vary for the current
                  year.
                </p>
              </div>
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

        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            {/* Expert Guidance CTA */}
            <div className="mt-16 bg-gradient-to-r from-yellow-50 to-emerald-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Need personalized guidance?
                </h3>
                <p className="text-gray-600">
                  Connect with our expert counselors to get personalized college
                  recommendations based on your NEET rank and preferences.
                </p>
              </div>
              <Link
                href="/counselling"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Book Counselling Session
              </Link>
            </div>
          </Container>
        </section>
      </div>
      <SignInPopup successCallback={processPayment} />
    </FELayout>
  )
}
