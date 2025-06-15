"use client"

import { Button } from "@/components/common/Button"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import Link from "@/components/common/Link"
import { generateColsPublic } from "@/components/common/Table/Cols"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { paymentType, priceType } from "@/utils/static"
import {
  cn,
  getLocalStorageItem,
  getPhoneFromUser,
  isExpired,
  saveToLocalStorage,
} from "@/utils/utils"
import { useParams } from "next/navigation"
import Script from "next/script"
import { useEffect, useState } from "react"

import PaymentCard from "./PaymentCard"

export default function CutOffPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [configYear, setConfigYear] = useState<any>([])
  const [amount, setAmount] = useState<number>(49)

  const { fetchData } = useFetch()
  const { appState } = useAppState()
  const { getSearchParams } = useInternalSearchParams()

  const params = useParams()

  const [rendererStatus, setRendererStatus] = useState<any>(null)

  useEffect(() => {
    if (
      appState?.hasUGPackage !== undefined ||
      appState?.hasPGPackage !== undefined
    ) {
      checkDataMode()
    }
  }, [appState.hasUGPackage, appState.hasPGPackage])

  async function checkPaymentStatus() {
    let college = getSearchParams("college")
    const state = getSearchParams("state")

    if (params?.id === "ug" && appState?.hasUGPackage) {
      await showCutoff()
    } else if (params?.id === "pg" && appState?.hasPGPackage) {
      await showCutoff()
    } else {
      if (college) {
        college = college.toLowerCase().trim().split(" ").join("-")
        const paymentStatus = getLocalStorageItem<any>(
          `payment-${state}-${params?.id}-${college}`,
        )

        if (!isExpired(paymentStatus, 6)) {
          await showCutoff()
        } else {
          setRendererStatus("NOT_PAID")
        }
      } else {
        setRendererStatus("NOT_PAID")
      }
    }
  }

  async function showCutoff() {
    setRendererStatus("PAID")
    const instituteName = getSearchParams("college")?.trim()

    const payload: Record<string, any> = {
      instituteName,
      courseType: params?.id?.toString()?.toUpperCase(),
      state: getSearchParams("state"),
    }

    const res = await fetchData({
      url: "/api/college_cut_off",
      params: payload,
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  async function checkDataMode() {
    const instituteName = getSearchParams("college")?.trim()

    const payload: Record<string, any> = {
      instituteName,
      dataCheckMode: true,
      courseType: params?.id?.toString()?.toUpperCase(),
      state: getSearchParams("state"),
    }

    const [dataRes, configRes, price] = await Promise.all([
      fetchData({
        url: "/api/college_cut_off",
        params: payload,
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CONFIG_YEAR" },
      }),
      fetchData({
        url: "/api/admin/configure_prices/get",
        params: {
          type:
            params.id === "ug"
              ? priceType.COLLEGE_CUT_OFF_UG
              : priceType.COLLEGE_CUT_OFF_PG,
          item: getSearchParams("state"),
        },
      }),
    ])

    if (dataRes?.payload?.hasData) {
      checkPaymentStatus()
    } else {
      setRendererStatus("NOT_FOUND")
    }

    if (configRes?.success) {
      setConfigYear(
        configRes?.payload?.data?.[0]?.text
          ?.split("-")
          .map((item: string) => item.trim()),
      )
    }

    if (price?.success) {
      setAmount(price?.payload?.data?.price)
    }
  }

  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10 bg-color-background">
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            {getSearchParams("college")?.trim()}
          </h2>

          {rendererStatus === "PAID" && (
            <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
          )}
        </div>

        <div
          className={cn(
            "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden mb-3",
          )}
        >
          <p className="animated-new text-center">
            Rotate your Phone to Landscape or Horizontal For Better view.
          </p>
        </div>

        <Renderer
          rendererStatus={rendererStatus}
          generateCols={generateColsPublic(configYear, {
            paid: true,
            course_ug_pg: params?.id?.toString(),
          } as any)}
          tableData={tableData}
          showCutoff={showCutoff}
          amount={amount}
          configYear={configYear}
        />
      </Container>
      <SignInPopup />
    </FELayout>
  )
}

function Renderer({
  rendererStatus,
  generateCols,
  tableData,
  showCutoff,
  amount,
  configYear,
}: {
  rendererStatus: string
  generateCols: TableColumn[]
  tableData: any
  showCutoff: () => void
  amount: number
  configYear: string[]
}) {
  const { getSearchParams } = useInternalSearchParams()

  const params = useParams()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()

  async function successCallback(orderId: string) {
    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    const payload: any = {
      orderId,
      amount,
      payment_type: paymentType?.COLLEGE_CUT_OFF,

      college_cut_off_details: {
        instituteName: getSearchParams("college")?.trim(),
        state: getSearchParams("state"),
        courseType: params?.id?.toString()?.toUpperCase(),
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
      showCutoff()

      let college = getSearchParams("college")
      const state = getSearchParams("state")

      if (college && state) {
        college = college.toLowerCase().trim().split(" ").join("-")
        saveToLocalStorage(
          `payment-${state}-${params?.id}-${college}`,
          new Date(),
        )

        await fetchData({
          url: "/api/payment",
          method: "POST",
          data: {
            [paymentType?.COLLEGE_CUT_OFF]: amount,
          },
          noLoading: true,
          noToast: true,
        })
      }
    }
  }

  if (rendererStatus === "NOT_FOUND") {
    return (
      <div className="grid place-items-center min-h-[240px] w-full px-4">
        <div>
          <div className="tab:hidden">
            <p className="text-xl tab:text-2xl pc:text-3xl">No Data found.</p>
            <p className="text-xl tab:text-2xl pc:text-3xl">
              for: {getSearchParams("college")}
            </p>
          </div>
          <div className="hidden tab:block">
            <p className="text-xl tab:text-2xl pc:text-3xl">
              No Data found. for: {getSearchParams("college")}{" "}
              {params?.id?.toString()?.toUpperCase()}
            </p>

            <Link href="/" className="w-full mt-6 block">
              <Button className="w-full text-lg">
                Predict More College Based On Your Rank
              </Button>
            </Link>
          </div>

          <Link href="/" className="w-full mt-6 block tab:hidden">
            <Button className="w-full">
              Predict More College
              <br />
              Based On Your Rank
            </Button>
          </Link>
        </div>
      </div>
    )
  } else if (rendererStatus === "PAID") {
    return (
      <div
        className="flex-1 border-color-border"
        style={{
          overflowX: "auto",
        }}
      >
        <Table columns={generateCols} data={tableData?.data} />
      </div>
    )
  } else if (rendererStatus === "NOT_PAID") {
    return (
      <div className="grid place-items-center min-h-[240px] w-full mt-12 mb-4 translate-y-[-100px]">
        <PaymentCard
          successCallback={successCallback}
          amount={amount}
          paymentDescription="Payment for Single College Cutoff at CollegeCutoff.net"
          title={
            <p className="uppercase poppinsFont">
              Please Make Payment To View Cutoff of: <br />
              {getSearchParams("college")}
            </p>
          }
          btnText={`Unlock Cut-Off Now @ ₹${amount}`}
        />
      </div>
    )
  } else {
    return (
      <div className="grid place-items-center min-h-[240px] w-full px-4">
        Loading College Details Please Wait...
      </div>
    )
  }
}

