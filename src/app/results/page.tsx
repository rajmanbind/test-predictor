"use client"

import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { Filter } from "@/components/frontend/college-predictor/Filter"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import useFetch from "@/hooks/useFetch"
import { onPageChange } from "@/utils/utils"
import { useEffect, useState } from "react"

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
  { title: "Closing Rank R1", tableKey: "closingRankR1", width: "150px" },
  { title: "Closing Rank R2", tableKey: "closingRankR2", width: "150px" },
  { title: "Closing Rank R3", tableKey: "closingRankR3", width: "150px" },
  { title: "Stray Round", tableKey: "strayRound", width: "150px" },
  { title: "Year", tableKey: "year" },
  { title: "Fees", tableKey: "fees", width: "100px" },
]

export default function ResultPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)

  const { fetchData } = useFetch()

  useEffect(() => {
    getData()
  }, [updateUI])

  async function getData() {
    const res = await fetchData({
      url: "/api/admin/get_data",
      params: {
        page: 1,
        size: 10,
      },
    })

    setTableData(res?.payload)
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
              columns={columns}
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
