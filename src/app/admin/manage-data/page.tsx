"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Card } from "@/components/common/Card"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Input } from "@/components/common/Input"
import Link from "@/components/common/Link"
import { Pagination, PaginationHandle } from "@/components/common/Pagination"
import { generateCols } from "@/components/common/Table/Cols"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { TableDeleteButton } from "@/components/common/Table/TableDeleteButton"
import { ConfirmEditYearPopup } from "@/components/common/popups/ConfirmEditYearPopup"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { cn, isEmpty, onPageChange, onTextFieldChange } from "@/utils/utils"
import { Info, Pencil, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

export default function ManageDataPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<any>([])

  const [popupOpen, setPopupOpen] = useState(false)
  const [updateUI, setUpdateUI] = useState(false)
  const [singleDelete, setSingleDelete] = useState<any>([])
  const [configYear, setConfigYear] = useState<any>([])

  const { setSearchParams } = useInternalSearchParams()

  const [rowData, setRowData] = useState<any>([])

  const [searchInput, setSearchInput] = useState("")

  const { fetchData } = useFetch()
  const { showToast } = useAppState()
  const searchParams = useSearchParams()

  const paginationRef = useRef<PaginationHandle>(null)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  useEffect(() => {
    getData()
  }, [updateUI])

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
          size: 20,
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

  async function onSubmit() {
    setSearchParams("page", "1")
    if (paginationRef.current) {
      paginationRef.current.setActivePage(1)
    }

    const res = await fetchData({
      url: `/api/admin/get_data`,
      params: { instituteName: searchInput, page: 1, size: 20 },
    })

    setTableData(res?.payload)
  }

  return (
    <BELayout className="mb-10 tab:mb-0 pc:max-w-[calc(100vw-213px)] p-0 ml-0 !px-0">
      <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
        <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
          Manage Data
        </h2>

        <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
      </div>

      <Card className="mt-4 py-6 px-0">
        <div className="flex flex-col tab:flex-row gap-4 tab:gap-0 justify-between mb-7 px-2">
          <form
            className="flex items-center gap-2 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="searchInput"
              type="text"
              placeholder="Search by Institute Name..."
              value={searchInput}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearchParams("page", "1")
                  if (paginationRef.current) {
                    paginationRef.current.setActivePage(1)
                  }
                  setTimeout(() => {
                    getData()
                  }, 50)
                }

                setSearchInput(e.target.value)
              }}
              control={control}
              setValue={setValue}
              rules={{
                required: false,
              }}
              errors={errors}
              dummyLabel="Search"
              errorClass="absolute"
              wrapperClass="w-full max-w-[230px] shrink-0"
              boxWrapperClass="py-1"
            />

            <button
              className={cn(
                "bg-color-accent hover:bg-color-accent-dark text-white text-sm py-[6px] px-4 rounded-md w-full tab:w-auto",
                !searchInput && " opacity-50",
              )}
              disabled={!searchInput}
            >
              Search
            </button>
          </form>

          <TableDeleteButton
            className="flex-shrink-0 w-fit self-end"
            title={`Delete ${selectedRows?.length} ${selectedRows?.length > 1 ? "rows" : "row"}`}
            onClick={() => setPopupOpen(true)}
            disabled={isEmpty(selectedRows)}
          />
        </div>

        <Table
          columns={generateCols(
            configYear,
            {
              isAdmin: true,
              setRowData,
              setPopupOpen,
              setSingleDelete,
            },
            showToast,
          )}
          data={tableData?.data}
          itemsCountPerPage={tableData?.pageSize}
          selectable
          onChange={(rows: any[]) => {
            setSelectedRows(rows)
          }}
        />

        <Pagination
          ref={paginationRef}
          currentPage={tableData?.currentPage}
          totalItems={tableData?.totalItems}
          itemsCountPerPage={tableData?.pageSize}
          wrapperClass="pb-[50px]"
          onPageChange={(page: number) => {
            onPageChange(page, "/api/admin/get_data", fetchData, setTableData, {
              size: 20,
              ...(searchInput && { instituteName: searchInput }),
            })
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
