"use client"

import { Button } from "@/components/common/Button"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Pagination, PaginationHandle } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import {
  Filter,
  IFormData,
} from "@/components/frontend/college-predictor/Filter"
import { FilterPopup } from "@/components/frontend/college-predictor/FilterPopup"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { priceType } from "@/utils/static"
import { cn, getLocalStorageItem, isEmpty, isExpired } from "@/utils/utils"
import { Settings2 } from "lucide-react"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
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

  const [paid, setPaid] = useState(false)
  const [amount, setAmount] = useState(149)

  const { fetchData } = useFetch()
  const { getSearchParams, setSearchParams } = useInternalSearchParams()

  const paginationRef = useRef<PaginationHandle>(null)

  const [mobFilterFormData, setMobFilterFormData] = useState<IFormData>({
    state: [],
    instituteType: [],
    category: [],
    quota: [],
  })

  useEffect(() => {
    verifyPurchases()
  }, [filterParams, updateUI])

  useEffect(() => {
    getConfigs()
  }, [])

  async function verifyPurchases() {
    let configRes: any = await fetchData({
      url: "/api/admin/configure/get",
      params: { type: "CONFIG_YEAR" },
    })

    if (configRes?.success) {
      setConfigYear(
        configRes?.payload?.data?.[0]?.text
          ?.split("-")
          .map((item: string) => item.trim()),
      )

      configRes = configRes?.payload?.data?.[0]?.text?.replaceAll(" ", "")
    }

    let payment = false
    const paymentStatus = getLocalStorageItem<any>(
      `payment-predictor-${getSearchParams("rank")}-${getSearchParams("course")}`,
    )

    if (paymentStatus) {
      if (
        paymentStatus?.rank !== getSearchParams("rank") ||
        paymentStatus?.course !== getSearchParams("course") ||
        paymentStatus?.year !== configRes ||
        isExpired(paymentStatus?.date, 6)
      ) {
        setPaid(false)
        payment = false
      } else {
        setPaid(true)
        payment = true
      }
    }

    getData(payment, isEmpty(filterParams) ? null : 1)
  }

  async function getConfigs() {
    const [quotaData, categoryData, coursesData, priceData] = await Promise.all(
      [
        fetchData({
          url: "/api/admin/configure/get",
          params: { type: "QUOTA" },
        }),
        fetchData({
          url: "/api/admin/configure/get",
          params: { type: "CATEGORY" },
        }),

        fetchData({
          url: "/api/admin/configure/courses/get",
          params: {
            type: getSearchParams("courseType")?.toString()?.toLowerCase(),
          },
        }),

        fetchData({
          url: "/api/admin/configure_prices/get",
          params: {
            type: priceType.RANK_COLLEGE_PREDICTOR,
          },
        }),
      ],
    )

    setQuotasList(quotaData?.payload?.data || [])
    setCategoriesList(categoryData?.payload?.data || [])
    setCoursesList(coursesData?.payload?.data || [])
    setAmount(priceData?.payload?.data?.[0]?.price)
  }

  async function getData(paymentStatus: boolean, paginationPage: any) {
    let page = 1

    if (paginationPage) {
      page = paginationPage
    } else {
      page = Number(getSearchParams("page") || 1)
    }

    const rank = getSearchParams("rank")
    const course = getSearchParams("course")
    const domicileState = getSearchParams("domicileState")
    const rankType = getSearchParams("rankType") ?? null
    const courseType = getSearchParams("courseType")

    const params: Record<string, any> = {
      page,
      size: 10,
      rank,
      rankType,
      course,
      courseType,
      domicileState,
      paymentStatus,
    }

    if (domicileState === "All") {
      delete params.domicileState
    }

    if (!isEmpty(filterParams)) {
      Object.entries(filterParams).forEach(([key, value]: any) => {
        if (!isEmpty(value)) {
          params[key] = value
        }
      })

      if (!paginationPage) {
        setSearchParams("page", "1")
        if (paginationRef.current) {
          paginationRef.current.setActivePage(1)
        }
      }
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

  function generateCols() {
    let currentYear = new Date().getFullYear()
    let previousYear = currentYear - 1

    const percentile_Marks =
      getSearchParams("rankType") === "Marks" ? "Marks" : "Percentile"

    if (!isEmpty(configYear)) {
      previousYear = configYear[0]
      currentYear = configYear[1]
    }

    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
      },
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
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
          </div>
        ),
        tableKey: `closingRankR1_new`,
        width: "190px",
        renderer({ cellData }) {
          // @ts-ignore
          return cellData
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
          </div>
        ),
        tableKey: `closingRankR2_new`,
        width: "190px",
        renderer({ cellData }: any) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock @ ₹${amount}`}
            >
              {cellData}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
          </div>
        ),
        tableKey: `closingRankR3_new`,
        width: "190px",
        renderer({ cellData }: any) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock @ ₹${amount}`}
            >
              {cellData}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
          >
            {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
          </div>
        ),
        tableKey: `strayRound_new`,
        width: "190px",
        renderer({ cellData }: any) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock @ ₹${amount}`}
            >
              {cellData}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
          >
            Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
          </div>
        ),
        tableKey: `lastStrayRound_new`,
        width: "190px",
        renderer({ cellData }: any) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock @ ₹${amount}`}
            >
              {cellData}
            </div>
          )
        },
      },

      // {
      //   title: (
      //     <div
      //       data-tooltip-id="tooltip"
      //       data-tooltip-content={`Closing Round ${previousYear} Round 1`}
      //     >
      //       CR {previousYear} [R1]
      //     </div>
      //   ),
      //   tableKey: `closingRankR1_old`,
      //   width: "130px",
      // },
      // {
      //   title: (
      //     <div
      //       data-tooltip-id="tooltip"
      //       data-tooltip-content={`Closing Round ${previousYear} Round 2`}
      //     >
      //       CR {previousYear} [R2]
      //     </div>
      //   ),
      //   tableKey: `closingRankR2_old`,
      //   width: "130px",
      // },
      // {
      //   title: (
      //     <div
      //       data-tooltip-id="tooltip"
      //       data-tooltip-content={`Closing Round ${previousYear} Round 3`}
      //     >
      //       CR {previousYear} [R3]
      //     </div>
      //   ),
      //   tableKey: `closingRankR3_old`,
      //   width: "130px",
      // },
      // {
      //   title: (
      //     <div
      //       data-tooltip-id="tooltip"
      //       data-tooltip-content={`Stray Round ${previousYear}`}
      //     >
      //       SR {previousYear}
      //     </div>
      //   ),
      //   tableKey: `strayRound_old`,
      //   width: "160px",
      // },

      // {
      //   title: (
      //     <div
      //       data-tooltip-id="tooltip"
      //       data-tooltip-content={`Last Stray Round ${previousYear}`}
      //     >
      //          Last <br />
      //         SR {previousYear}
      //     </div>
      //   ),
      //   tableKey: `lastStrayRound_old`,
      //   width: "160px",
      // },

      // { title: "Fees", tableKey: "fees", width: "100px" },
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      { title: "State", tableKey: "state", width: "150px" },
      { title: "Fees", tableKey: "fees", width: "100px" },
    ]

    return columns
  }

  function filterCount() {
    let count = 0

    if (!isEmpty(mobFilterFormData?.state)) {
      count += mobFilterFormData?.state?.length
    }

    if (!isEmpty(mobFilterFormData?.instituteType)) {
      count += mobFilterFormData?.instituteType?.length
    }

    if (!isEmpty(mobFilterFormData?.category)) {
      count += mobFilterFormData?.category?.length
    }

    if (!isEmpty(mobFilterFormData?.quota)) {
      count += mobFilterFormData?.quota?.length
    }

    return count
  }

  return (
    <FELayout>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Container className="pb-10 pt-1 pc:pt-10">
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            NEET Collage Predictor
          </h2>

          <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
        </div>

        <div
          className={cn(
            "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
          )}
        >
          <p className="animated-new text-center">
            Rotate your Phone to Landscape or Horizontal For Better view.
          </p>
        </div>

        <div className="mt-10 block pc:flex items-start rounded-lg relative">
          {paid && (
            <>
              <Filter
                className="flex-shrink-0 w-[300px] hidden pc:flex"
                quotasList={quotasList}
                categoryList={categoriesList}
                setFilterParams={setFilterParams}
              />

              <Button
                className="flex items-center gap-2 text-white px-4 ml-auto mt-2 relative text-sm pc:hidden mb-3 bg-color-table-header hover:bg-color-table-header w-[150px] py-4"
                onClick={() => setFilterPopup(true)}
              >
                {filterCount() > 0 && (
                  <p className="bg-red-600 size-5 rounded-full absolute top-[-10px] right-[-3px] grid place-items-center text-white font-semibold text-xs">
                    {filterCount()}
                  </p>
                )}
                <Settings2 size={18} />
                Filter Colleges
              </Button>
            </>
          )}

          <div
            className="flex-1 border-color-border"
            style={{
              overflowX: "auto",
            }}
          >
            <SearchForm coursesList={coursesList} setUpdateUI={setUpdateUI} />

            <Table
              columns={generateCols()}
              data={tableData?.data}
              className="mt-6 min-h-[600px]"
              renderBelowTable={
                paid || isEmpty(tableData?.data) ? null : (
                  <TableSignup
                    totalRecords={tableData?.totalItems}
                    setUpdateUI={setUpdateUI}
                    amount={amount}
                    configYear={configYear}
                  />
                )
              }
            />

            <Pagination
              ref={paginationRef}
              currentPage={tableData?.currentPage}
              totalItems={tableData?.totalItems}
              showOnlyOnePage={!paid}
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => getData(paid, page)}
            />
          </div>
        </div>

        <FilterPopup
          isOpen={filterPopup}
          quotasList={quotasList}
          categoryList={categoriesList}
          setFilterParams={setFilterParams}
          setMobFilterFormData={setMobFilterFormData}
          mobFilterFormData={mobFilterFormData}
          onClose={() => setFilterPopup(false)}
          onConfirm={() => {}}
        />
      </Container>

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
      <SignInPopup />
    </FELayout>
  )
}

