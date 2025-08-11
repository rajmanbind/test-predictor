
"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Card } from "@/components/common/Card"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Input } from "@/components/common/Input"
import { Pagination, PaginationHandle } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { generateCols } from "@/components/common/Table/Cols"
import { Table } from "@/components/common/Table/Table"
import { TableDeleteButton } from "@/components/common/Table/TableDeleteButton"
import { ConfirmEditYearPopup } from "@/components/common/popups/ConfirmEditYearPopup"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { autoComplete, cn, isEmpty } from "@/utils/utils"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

interface IFormData {
  courses?: IOption
  courseType?: IOption
}

export default function ManageDataPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [updateUI, setUpdateUI] = useState(false)
  const [singleDelete, setSingleDelete] = useState<any>([])
  const [configYear, setConfigYear] = useState<any>([])
  const [stateList, setStateList] = useState<IOption[]>([])
  const [courseTypeList, setCourseTypeList] = useState<IOption[]>([])
  const [courseType, setCourseType] = useState<IOption | undefined>()
  const [seletectedState, setSeletectedState] = useState<IOption | undefined>()
  const [rowData, setRowData] = useState<any>([])
  const [searchInput, setSearchInput] = useState("")

  const paginationRef = useRef<PaginationHandle>(null)

  const { fetchData } = useFetch()
  const { showToast } = useAppState()
  const searchParams = useSearchParams()
  const { setSearchParams } = useInternalSearchParams()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseType,
      state: seletectedState,
    },
  })

  console.log(selectedRows)
  // Fetch dropdown data on first mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statesRes, coursesRes] = await Promise.all([
          fetch("/api/states"),
          fetch("/api/get-courses-types"),
        ])
        const statesJson = await statesRes.json()
        const coursesJson = await coursesRes.json()

        const states = [
          { id: "All States", code: "All", text: "All States" },
          ...(statesJson?.data || []),
        ]
        const courses =
          (coursesJson?.data || []).map((q: IOption) => ({
            id: q.id,
            text: q.type,
          })) || []

        setStateList(states)
        setCourseTypeList(courses)

        const defaultState =
          states.find((s:IOption) => s.code === "WB" || s.text === "WB") || states[0]
        const defaultCourse =
          courses.find((c:IOption) => c.text === "NEET PG") || courses[0]
        setSeletectedState(defaultState)
        setCourseType(defaultCourse)

      } catch (error) {
        console.error("Initial data load error:", error)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch table data after default dropdown values are loaded
  useEffect(() => {
    if (seletectedState?.code && courseType?.text) {
      getData(1)
    }
  }, [seletectedState?.code, courseType?.text, updateUI])

  async function getData(pageOverride: number = 1, searchOverride?: string) {
    if (!seletectedState?.code || !courseType?.text) {
      showToast("error", "Both State and Course Type are required.")
      return
    }

    const page = pageOverride ?? Number(searchParams.get("page") || 1)
    const search = searchOverride ?? searchInput

    const [dataRes, configRes] = await Promise.all([
      fetchData({
        url: "/api/admin/get_data",
        params: {
          page,
          size: 20,
          stateCode: seletectedState.code,
          courseType: courseType.text,
          ...(search && { instituteName: search }),
        },
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CONFIG_YEAR" },
      }),
    ])

    if (dataRes?.success) setTableData(dataRes.payload)

    if (configRes?.success) {
      setConfigYear(
        configRes?.payload?.data?.[0]?.text
          ?.split("-")
          .map((item: string) => item.trim())
      )
    }
  }

  // async function deleteData() {
  //   let id: string[] =
  //     singleDelete?.length > 0
  //       ? singleDelete
  //       : selectedRows?.map((row: any) => row.new_id || row.prev_id)

  //       console.log(id)
  //   // const res = await fetchData({
  //   //   url: "/api/admin/delete_data",
  //   //   method: "POST",
  //   //   data: { id,stateCode:seletectedState?.code },
  //   // })

  //   // setSingleDelete([])

  //   // if (res?.success) {
  //   //   showToast("success", res?.payload?.msg)
  //   //   setUpdateUI((prev) => !prev)
  //   // }
  // }

  async function deleteData() {
  const idsToDelete: string[] =
    singleDelete?.length > 0
      ? singleDelete
      : selectedRows?.map((row: any) => row.id)
  if (!idsToDelete.length) {
    showToast("error", "No rows selected for deletion.")
    return
  }
  try {
    const res = await fetchData({
      url: "/api/admin/delete_data",
      method: "POST",
      data: {
        id: idsToDelete,
        stateCode: seletectedState?.code,
      },
    })

    setSingleDelete([])
    setSelectedRows([])
    setPopupOpen(false)

    if (res?.success) {
      showToast("success", res?.payload?.msg || "Deleted successfully")
      setUpdateUI((prev) => !prev)
    } else {
      showToast("error", res?.payload?.msg || "Failed to delete")
    }
  } catch (error) {
    showToast("error", "Something went wrong during deletion.")
    console.error("Delete error:", error)
  }
}

  async function onSubmit() {
    setSearchParams("page", "1")
    paginationRef.current?.setActivePage(1)

    if (!seletectedState?.code || !courseType?.text) {
      showToast("error", "Both State and Course Type are required.")
      return
    }

    getData(1, searchInput)
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
        <div className="flex items-center sm:flex-row flex-col  px-2 md:gap-20 gap-5 mb-7">
          {/* <SearchAndSelect
            name="courseType"
            label="Course Type"
            placeholder="Select Course Type"
            value={courseType}
            onChange={({ selectedValue }) => {
              setCourseType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={courseTypeList}
            defaultOption={courseType}
            wrapperClass="max-w-[395px]"
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, courseTypeList, setOptions)
            }
            errors={errors}
          />

          <SearchAndSelect
            name="state"
            label="State"
            placeholder="Search and Select"
            value={seletectedState}
            onChange={({ selectedValue }) => {
              setSeletectedState(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={stateList}
            defaultOption={seletectedState}
            wrapperClass="max-w-[395px]"
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, stateList, setOptions)
            }
            errors={errors}
          /> */}
{/* <SearchAndSelect
  name="courseType"
  label="Course Type"
  placeholder="Select Course Type"
  value={courseType}
  onChange={({ selectedValue }) => setCourseType(selectedValue)}
  control={control}
  setValue={setValue}
  required
  options={courseTypeList}
  wrapperClass="max-w-[395px]"
  debounceDelay={0}
   defaultOption={stateList.find(s => s.text === "NEET PG")}
  searchAPI={(text, setOptions) =>
    autoComplete(text, courseTypeList, setOptions)
  }
  errors={errors}
/>

<SearchAndSelect
  name="state"
  label="State"
  placeholder="Search and Select"
  value={seletectedState}
  onChange={({ selectedValue }) => setSeletectedState(selectedValue)}
  control={control}
  setValue={setValue}
  required
  options={stateList}
  wrapperClass="max-w-[395px]"
  debounceDelay={0}
 defaultOption={stateList.find(s => s.code === "WB")}
  searchAPI={(text, setOptions) =>
    autoComplete(text, stateList, setOptions)
  }
  errors={errors}
/>

// In your ManageDataPage component, update the SearchAndSelect components like this:
 */}
<SearchAndSelect
            name="courseType"
            label="Course Type"
            placeholder="Select Course Type"
            options={courseTypeList}
            control={control}
            setValue={setValue}
            required
            searchAPI={(text, setOptions) => autoComplete(text, courseTypeList, setOptions)}
            defaultOption={courseTypeList.find(c => c.text === "NEET PG")}
            wrapperClass="max-w-[395px]"
            onChange={({ name, selectedValue }) => {
              setValue("courseType", selectedValue)
              setCourseType(selectedValue)
            } } 
            
            // value={courseType} errors={errors}
            
            
            
            />

<SearchAndSelect
  name="state"
  label="State"
  placeholder="Search and Select"
  options={stateList}
  control={control}
  setValue={setValue}
  required
  searchAPI={(text, setOptions) =>
    autoComplete(text, stateList, setOptions)
  }
  defaultOption={stateList.find(s => s.code === "WB")}
  wrapperClass="max-w-[395px]"
  onChange={({ name, selectedValue }) => {
    setValue("state", selectedValue);
    setSeletectedState(selectedValue)
  }}

// value={courseType} errors={errors}



/>
          <button
            className={cn(
              "bg-color-accent hover:bg-color-accent-dark text-white text-sm py-[6px] px-4 rounded-md w-full tab:w-auto hidden md:block"
            )}
            onClick={() => getData()}
            disabled={!seletectedState?.code || !courseType?.text}
          >
            Find
          </button>
        </div>

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
                const val = e.target.value
                setSearchInput(val)
                if (val === "") {
                  setSearchParams("page", "1")
                  paginationRef.current?.setActivePage(1)
                  setTimeout(() => getData(1), 50)
                }
              }}
              control={control}
              setValue={setValue}
              rules={{ required: false }}
              errors={errors}
              dummyLabel="Search"
              errorClass="absolute"
              wrapperClass="w-full max-w-[230px] shrink-0"
              boxWrapperClass="py-1"
            />
            <button
              className={cn(
                "bg-color-accent hover:bg-color-accent-dark text-white text-sm py-[6px] px-4 rounded-md w-full tab:w-auto",
                !searchInput && "opacity-50"
              )}
              disabled={!searchInput}
            >
              Search
            </button>
          </form>

          <TableDeleteButton
            className="flex-shrink-0 w-fit self-end"
            title={`Delete ${selectedRows.length} row${selectedRows.length > 1 ? "s" : ""}`}
            onClick={() =>{ setPopupOpen(true)


deleteData()
            }}
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
            courseType?.text,
seletectedState
          )}
          data={tableData?.data}
          itemsCountPerPage={tableData?.pageSize}
          selectable
          onChange={(rows: any[]) => setSelectedRows(rows)}
        />

        <Pagination
          ref={paginationRef}
          currentPage={tableData?.currentPage}
          totalItems={tableData?.totalItems}
          itemsCountPerPage={tableData?.pageSize}
          wrapperClass="pb-[50px]"
          onPageChange={(page: number) => getData(page)}
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



