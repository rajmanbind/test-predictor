"use client"

import { Button } from "@/components/common/Button"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Pagination } from "@/components/common/Pagination"
import { generateColsPublic } from "@/components/common/Table/Cols"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { Filter } from "@/components/frontend/college-predictor/Filter"
import { FilterPopup } from "@/components/frontend/college-predictor/FilterPopup"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { isEmpty } from "@/utils/utils"
import { Info, Settings2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

import TableSignup from "./TableSignup"

export default function ResultPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [configYear, setConfigYear] = useState<any>([])
  const [categoriesList, setCategoriesList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [quotasList, setQuotasList] = useState<IOption[]>([])

  const [filterPopup, setFilterPopup] = useState(false)
  const [filterParams, setFilterParams] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)

  const { fetchData } = useFetch()
  const { getSearchParams } = useInternalSearchParams()

  useEffect(() => {
    getData()
  }, [filterParams, updateUI])

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

  async function getData() {
    const page = Number(getSearchParams("page") || 1)
    const rank = getSearchParams("rank")
    const state = getSearchParams("state")
    const course = getSearchParams("course")
    const category = getSearchParams("category")

    const params: Record<string, any> = {
      page,
      size: 10,
      rank,
      states: state,
      course,
      category,
    }

    if (state !== "All") {
      params.states = state
    } else {
      delete params.states
    }

    if (!isEmpty(filterParams)) {
      Object.entries(filterParams).forEach(([key, value]: any) => {
        if (!isEmpty(value)) {
          params[key] = value
        }
      })
    }

    const [dataRes, configRes] = await Promise.all([
      fetchData({
        url: "/api/predict_college",
        params,
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
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            NEET Collage Predictor
          </h2>

          <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
        </div>

        <div className="mt-10 block pc:flex items-start rounded-lg relative">
          <Filter
            className="flex-shrink-0 w-[300px] hidden pc:flex"
            quotasList={quotasList}
            categoryList={categoriesList}
            setFilterParams={setFilterParams}
          />

          <Button
            className="flex items-center gap-2 text-white py-2 px-4 ml-auto mt-2 relative text-sm pc:hidden mb-3"
            onClick={() => setFilterPopup(true)}
          >
            <Settings2 size={18} />
            Filter
          </Button>

          <div
            className="flex-1 border-color-border"
            style={{
              overflowX: "auto",
            }}
          >
            <SearchForm
              categoriesList={categoriesList}
              coursesList={coursesList}
              setUpdateUI={setUpdateUI}
            />

            <Table
              columns={generateColsPublic(configYear)}
              data={tableData?.data}
              className="mt-6 min-h-[600px]"
              renderBelowTable={
                isEmpty(tableData?.data) ? null : (
                  <TableSignup totalRecords={tableData?.totalItems} />
                )
              }
            />

            <Pagination
              currentPage={tableData?.currentPage}
              totalItems={tableData?.totalItems}
              showOnlyOnePage
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => {
                fetchData({
                  url: "/api/predict_college",
                  params: {
                    page,
                    size: 10,
                    rank: getSearchParams("rank"),
                  },
                }).then((data: any) => {
                  setTableData(data?.payload)
                })
              }}
            />
          </div>
        </div>

        <FilterPopup
          isOpen={filterPopup}
          quotasList={quotasList}
          categoryList={categoriesList}
          setFilterParams={setFilterParams}
          onClose={() => setFilterPopup(false)}
          onConfirm={() => {}}
        />
      </Container>

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
      <SignInPopup />
    </FELayout>
  )
}
