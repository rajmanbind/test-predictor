"use client"

import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { Filter } from "@/components/frontend/college-predictor/Filter"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import useFetch from "@/hooks/useFetch"
import { isEmpty, onPageChange } from "@/utils/utils"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const currentYear = new Date().getFullYear()
const previousYear = currentYear - 1

export default function ResultPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)
  const [configYear, setConfigYear] = useState<any>([])

  const { fetchData } = useFetch()
  const searchParams = useSearchParams()

  useEffect(() => {
    getData()
  }, [updateUI])

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

  async function getData() {
    const page = Number(searchParams.get("page") || 1)

    const [dataRes, configRes] = await Promise.all([
      fetchData({
        url: "/api/admin/get_data",
        params: {
          page,
          size: 10,
        },
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CONFIG_YEAR" },
      }),
    ])

    if (dataRes?.success) {
      setTableData(dataRes?.payload)
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
      <Container className="py-10">
        <h2 className="text-color-text text-3xl pb-6">
          NEET Collage Predictor
        </h2>

        <SearchForm />

        <div className="mt-10 bg-color-form-background flex items-start py-4 rounded-lg pr-3">
          <Filter className="p-3 flex-shrink-0 w-[300px] pr-2 border-r border-color-border" />

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

            <Pagination
              currentPage={tableData?.page}
              totalItems={tableData?.total}
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => {
                onPageChange(
                  page,
                  "/api/admin/get_data",
                  fetchData,
                  setTableData,
                )
              }}
            />
          </div>
        </div>
      </Container>
    </FELayout>
  )
}
