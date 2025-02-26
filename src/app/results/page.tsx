"use client"

import { Button } from "@/components/common/Button"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { Filter } from "@/components/frontend/college-predictor/Filter"
import { FilterPopup } from "@/components/frontend/college-predictor/FilterPopup"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { isEmpty, onPageChange } from "@/utils/utils"
import { Info, Settings2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResultPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)
  const [configYear, setConfigYear] = useState<any>([])
  const [categoriesList, setCategoriesList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [quotasList, setQuotasList] = useState<IOption[]>([])

  const [filterPopup, setFilterPopup] = useState(false)

  const { fetchData } = useFetch()
  const searchParams = useSearchParams()

  useEffect(() => {
    getData()
  }, [updateUI])

  useEffect(() => {
    getConfigs()
  }, [])

  async function getConfigs() {
    const [quotaData, categoryData, coursesData] = await Promise.all([
      fetchData({ url: "/api/admin/configure/get", params: { type: "QUOTA" } }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CATEGORY" },
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "COURSES" },
      }),
    ])

    setQuotasList(quotaData?.payload?.data || [])
    setCategoriesList(categoryData?.payload?.data || [])
    setCoursesList(coursesData?.payload?.data || [])
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
      <Container className="pb-10 pt-1 pc:pt-10">
        <div className="flex items-end pc:items-start justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 order-2 pc:order-1 pt-4">
            NEET Collage Predictor
          </h2>

          <div className="flex items-center gap-3 mr-2 order-1 pc:order-2 flex-shrink-0">
            <div className="text-xs pc:text-sm text-color-subtext">
              <p>CR - Closing Ranks</p>
              <p>SR - Stray Ranks</p>
            </div>
            <Info className="text-blue-600" size={24} />
          </div>
        </div>

        <SearchForm categoriesList={categoriesList} coursesList={coursesList} />

        <div className="mt-10 bg-color-form-background block pc:flex items-start py-4 rounded-lg pr-3 relative">
          <Filter className="p-3 flex-shrink-0 w-[300px] hidden pc:block" />

          <Button
            className="flex items-center gap-2 text-white py-2 px-4 ml-auto mt-2 relative text-sm pc:hidden"
            onClick={() => setFilterPopup(true)}
          >
            <div className="bg-red-600 size-5 rounded-full text-sm grid place-items-center absolute right-[-5px] top-[-7px]">
              3
            </div>
            <Settings2 size={18} />
            Filter
          </Button>

          <div className="bg-color-border h-[calc(100%-160px)] w-[1px] absolute left-[298px] top-0 my-10 hidden pc:block"></div>

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
              currentPage={tableData?.currentPage}
              totalItems={tableData?.totalItems}
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

        <FilterPopup
          isOpen={filterPopup}
          onClose={() => setFilterPopup(false)}
          onConfirm={() => {}}
        />
      </Container>
    </FELayout>
  )
}
