"use client"

import { Button } from "@/components/common/Button"
import Link from "@/components/common/Link"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { getLocalStorageItem, isEmpty, saveToLocalStorage } from "@/utils/utils"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import PaymentCard from "./PaymentCard"

export default function CutOffPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [configYear, setConfigYear] = useState<any>([])

  const [updateUI, setUpdateUI] = useState(false)

  const { fetchData } = useFetch()
  const { getSearchParams } = useInternalSearchParams()

  const [rendererStatus, setRendererStatus] = useState<any>(null)

  useEffect(() => {
    checkDataMode()
  }, [updateUI])

  async function checkPaymentStatus() {
    let college = getSearchParams("college")

    if (college) {
      college = college.toLowerCase().trim().split(" ").join("-")
      const paymentStatus = getLocalStorageItem<any>(`payment-${college}`)

      if (paymentStatus) {
        await showCutoff()
      } else {
        setRendererStatus("NOT_PAID")
      }
    } else {
      setRendererStatus("NOT_PAID")
    }
  }

  async function showCutoff() {
    setRendererStatus("PAID")
    const instituteName = getSearchParams("college")?.trim()

    const params: Record<string, any> = {
      instituteName,
    }

    const res = await fetchData({
      url: "/api/college_cut_off",
      params,
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  function generateCols() {
    let currentYear = new Date().getFullYear()
    let previousYear = currentYear - 1

    if (!isEmpty(configYear)) {
      previousYear = configYear[0]
      currentYear = configYear[1]
    }

    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "200px",
      },
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      { title: "State", tableKey: "state", width: "150px" },
      { title: "Course", tableKey: "course" },
      { title: "Quota", tableKey: "quota", width: "150px" },
      { title: "Category", tableKey: "category" },
      {
        title: `CR ${previousYear} [R1]`,
        tableKey: `closingRankR1_old`,
        width: "130px",
      },
      {
        title: `CR ${previousYear} [R2]`,
        tableKey: `closingRankR2_old`,
        width: "130px",
      },
      {
        title: `CR ${previousYear} [R3]`,
        tableKey: `closingRankR3_old`,
        width: "130px",
      },
      {
        title: `SR ${previousYear}`,
        tableKey: `strayRound_old`,
        width: "110px",
      },
      {
        title: `CR ${currentYear} [R1]`,
        tableKey: `closingRankR1_new`,
        width: "130px",
      },
      {
        title: `CR ${currentYear} [R2]`,
        tableKey: `closingRankR2_new`,
        width: "130px",
      },
      {
        title: `CR ${currentYear} [R3]`,
        tableKey: `closingRankR3_new`,
        width: "130px",
      },
      {
        title: `SR ${currentYear}`,
        tableKey: `strayRound_new`,
        width: "110px",
      },
      { title: "Fees", tableKey: "fees", width: "100px" },
    ]

    return columns
  }

  async function checkDataMode() {
    const instituteName = getSearchParams("college")?.trim()

    const params: Record<string, any> = {
      instituteName,
      dataCheckMode: true,
    }

    const [dataRes, configRes] = await Promise.all([
      fetchData({
        url: "/api/college_cut_off",
        params,
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CONFIG_YEAR" },
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
  }

  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10">
        <div className="flex items-end pc:items-start justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 order-2 pc:order-1 pt-4">
            NEET Collage Cut-off
          </h2>

          <div className="flex items-start gap-3 mr-2 order-1 pc:order-2 flex-shrink-0">
            <div className="text-xs pc:text-sm text-color-subtext">
              <p>Click on the record for detailed information and factors.</p>
              <p>
                (*) Indicates additional remarks available in Details & Factors.
              </p>
              <p>Click on Rank to view the allotment list.</p>
            </div>
            <Info className="text-blue-600" size={24} />
          </div>
        </div>

        <Renderer
          rendererStatus={rendererStatus}
          generateCols={generateCols}
          tableData={tableData}
          showCutoff={showCutoff}
        />
      </Container>
    </FELayout>
  )
}

function Renderer({
  rendererStatus,
  generateCols,
  tableData,
  showCutoff,
}: {
  rendererStatus: string
  generateCols: () => TableColumn[]
  tableData: any
  showCutoff: () => void
}) {
  const { getSearchParams } = useInternalSearchParams()

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
              No Data found. for: {getSearchParams("college")}
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
        className="flex-1 border-color-border pl-2"
        style={{
          overflowX: "auto",
        }}
      >
        <Table
          columns={generateCols()}
          data={tableData?.data}
          className="mt-6 min-h-[600px]"
        />
      </div>
    )
  } else if (rendererStatus === "NOT_PAID") {
    return (
      <div className="grid place-items-center min-h-[240px] w-full mt-12 mb-4">
        <PaymentCard showCutoff={showCutoff} />
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
