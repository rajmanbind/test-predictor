"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Card } from "@/components/common/Card"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import useFetch from "@/hooks/useFetch"
import { onPageChange } from "@/utils/utils"
import React, { useEffect, useState } from "react"

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
  { title: "Fees", tableKey: "fees", width: "100px" },
  { title: "Closing Rank R1", tableKey: "closingRankR1", width: "150px" },
  { title: "Closing Rank R2", tableKey: "closingRankR2", width: "150px" },
  { title: "Closing Rank R3", tableKey: "closingRankR3", width: "150px" },
  { title: "Stray Round", tableKey: "strayRound", width: "150px" },
  { title: "Year", tableKey: "year" },
]

export default function ManageDataPage() {
  const [tableData, setTableData] = useState<any>(null)

  const { fetchData } = useFetch()

  useEffect(() => {
    getData()
  }, [])

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
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Manage Data</Heading>

      <Card className="mt-4 p-6">
        <Table
          columns={columns}
          data={tableData?.data}
          selectable
          onChange={(selectedRow: any[]) => {
            console.log("selectedRow: ", selectedRow)
          }}
        />

        <Pagination
          currentPage={tableData?.page}
          totalItems={tableData?.total}
          wrapperClass="pb-[50px]"
          onPageChange={(page: number) => {
            onPageChange(page, "/api/admin/get_data", fetchData, setTableData)
          }}
        />
      </Card>
    </BELayout>
  )
}
