"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Card } from "@/components/common/Card"
import Link from "@/components/common/Link"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { TableDeleteButton } from "@/components/common/TableDeleteButton"
import { ConfirmEditYearPopup } from "@/components/common/popups/ConfirmEditYearPopup"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { isEmpty, onPageChange } from "@/utils/utils"
import { Info, Pencil, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

export default function ManageDataPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<any>([])

  const [popupOpen, setPopupOpen] = useState(false)
  const [updateUI, setUpdateUI] = useState(false)
  const [singleDelete, setSingleDelete] = useState<any>([])
  const [configYear, setConfigYear] = useState<any>([])

  const [rowData, setRowData] = useState<any>([])

  const { fetchData } = useFetch()
  const { showToast } = useAppState()
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
            data-tooltip-content={`Closing Round ${currentYear} Round 1`}
          >
            CR {currentYear} [R1]
          </div>
        ),
        tableKey: `closingRankR1_new`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${currentYear} Round 2`}
          >
            CR {currentYear} [R2]
          </div>
        ),
        tableKey: `closingRankR2_new`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${currentYear} Round 3`}
          >
            CR {currentYear} [R3]
          </div>
        ),
        tableKey: `closingRankR3_new`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round ${currentYear}`}
          >
            SR {currentYear}
          </div>
        ),
        tableKey: `strayRound_new`,
        width: "110px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${previousYear} Round 1`}
          >
            CR {previousYear} [R1]
          </div>
        ),
        tableKey: `closingRankR1_old`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${previousYear} Round 2`}
          >
            CR {previousYear} [R2]
          </div>
        ),
        tableKey: `closingRankR2_old`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Round ${previousYear} Round 3`}
          >
            CR {previousYear} [R3]
          </div>
        ),
        tableKey: `closingRankR3_old`,
        width: "130px",
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round ${previousYear}`}
          >
            SR {previousYear}
          </div>
        ),
        tableKey: `strayRound_old`,
        width: "110px",
      },
      { title: "Fees", tableKey: "fees", width: "100px" },
      {
        title: "Action",
        tableKey: "action",
        overrideInternalClick: true,
        width: "70px",
        renderer: ({ rowData }) => {
          if (rowData?.new_id && rowData?.prev_id) {
            return (
              <div className="flex items-center gap-2">
                <Pencil
                  size={20}
                  className="text-color-text hover:text-blue-600 cursor-pointer"
                  onClick={() => {
                    setRowData(rowData)
                  }}
                />

                <Trash2
                  size={20}
                  className="text-color-text hover:text-red-600 cursor-pointer"
                  onClick={() => {
                    setSingleDelete([rowData?.new_id, rowData?.prev_id])
                    setPopupOpen(true)
                  }}
                />
              </div>
            )
          }

          const id = rowData?.new_id || rowData?.prev_id

          return (
            <div className="flex items-center gap-2">
              <Link href={`/admin/edit-data/${id}`}>
                <Pencil
                  size={20}
                  className="text-color-text hover:text-blue-600 cursor-pointer"
                />
              </Link>
              <Trash2
                size={20}
                className="text-color-text hover:text-red-600 cursor-pointer"
                onClick={() => {
                  setSingleDelete([id])
                  setPopupOpen(true)
                }}
              />
            </div>
          )
        },
      },
    ]

    return columns
  }

  async function deleteData() {
    let id: any = []

    if (singleDelete?.length > 0) {
      id = singleDelete
    } else {
      id = selectedRows?.map((row: any) => row.new_id || row.prev_id)
    }

    const res = await fetchData({
      url: "/api/admin/delete_data",
      method: "POST",
      data: {
        id,
      },
    })

    setSingleDelete([])

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      setUpdateUI((prev) => !prev)
    }
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
    <BELayout className="mb-10 tab:mb-0 pc:max-w-[calc(100vw-213px)] p-0 ml-0 !px-0">
      <div className="flex justify-between px-4">
        <Heading>Manage Data</Heading>

        <div>
          <div className="bg-color-accent py-2 px-4 text-white text-sm rounded-md flex items-center gap-2 w-fit self-end mb-2 ml-auto">
            Closing Rank Guide <Info size={24} />
          </div>

          <p>Click on the record for detailed information and factors.</p>
          <p>
            (*) Indicates additional remarks available in Details & Factors.
          </p>
          <p>Click on Rank to view the allotment list.</p>
        </div>
      </div>

      <Card className="mt-4 py-6 px-0">
        <div className="flex justify-between mb-3 px-4">
          <h2 className="text-sm pc:text-base">Total Registered Institutes</h2>

          <TableDeleteButton
            className="flex-shrink-0"
            title={`Delete ${selectedRows?.length} ${selectedRows?.length > 1 ? "rows" : "row"}`}
            onClick={() => setPopupOpen(true)}
            disabled={isEmpty(selectedRows)}
          />
        </div>

        <Table
          columns={generateCols()}
          data={tableData?.data}
          selectable
          onChange={(rows: any[]) => {
            setSelectedRows(rows)
          }}
        />

        <Pagination
          currentPage={tableData?.currentPage}
          totalItems={tableData?.totalItems}
          wrapperClass="pb-[50px]"
          onPageChange={(page: number) => {
            onPageChange(page, "/api/admin/get_data", fetchData, setTableData)
          }}
        />
      </Card>

      <ConfirmEditYearPopup
        isOpen={!isEmpty(rowData)}
        onClose={() => setRowData(null)}
        rowData={rowData}
      />

      <ConfirmationPopup
        isOpen={popupOpen}
        title="Are You Sure You Want To Delete ?"
        text="This action cannot be undone."
        onClose={() => setPopupOpen(false)}
        onConfirm={deleteData}
      />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}
