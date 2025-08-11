"use client"

import { Button } from "@/components/common/Button"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import useFetch from "@/hooks/useFetch"
import { paymentType } from "@/utils/static"
import { cn, getLocalStorageItem, isEmpty } from "@/utils/utils"
import { ChevronLeft, Users } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function StateClosingRanksPage() {
  const [tableData, setTableData] = useState<any>(null)

  const [configYear, setConfigYear] = useState<any>([])

  const params = useParams()
  const stateCode = decodeURIComponent(params.state as any)
  const searchParams = useSearchParams()
  const courseType = searchParams.get("courseType")
  const course = searchParams.get("course")
const state = searchParams.get("state")
  const page = Number(searchParams.get("page") || 1)
  const courseParams = searchParams.get("course")
  const { fetchData } = useFetch()
 const currentYear = new Date().getFullYear()
 const prevYear  = currentYear-1
  useEffect(() => {
    const closingRankCollege = getLocalStorageItem<any>(
      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
    )
console.log("Data from LocalStorage: ",paymentType.SINGLE_COLLEGE_CLOSING_RANK)
    // setYear(closingRankCollege?.year)

    getData(closingRankCollege)
  }, [])

  async function getData(closingRankCollege: any) {
    // const [configRes, closingRanksRes] = await Promise.all([
    //   fetchData({
    //     url: "/api/admin/configure/get",
    //     params: { type: "CONFIG_YEAR" },
    //   }),
     const res = await  fetchData({
        method: "POST",
        url: "/api/closing_ranks",
        params: {
          page,
          size: 20,
        },
        data: {
          closingRankCollege,
          stateCode
        },
      })
    // ])


  // console.log("Response Data: ",res?.payload?.data)


    if (res?.success) {
      setTableData(res?.payload)
    }

    // if (res?.success) {
    //   setConfigYear(
    //     configRes?.payload?.data?.[0]?.text
    //       ?.split("-")
    //       .map((item: string) => item.trim()),
    //   )
    // }
  }

  function generateCols() {
    const percentile_Marks = courseType?.includes("UG") ? "Marks" : "Percentile"

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
        width: "150px",
      },
      { title: "Course", tableKey: "course" },
      { title: "Quota", tableKey: "quota", width: "150px" },
      { title: "Sub - Quota", tableKey: "subQuota", width: "150px" },
      { title: "Category", tableKey: "category", width: "150px" },
      { title: "Sub - Category", tableKey: "subCategory", width: "150px" },
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
        tableKey: `showClosingRankR1`,
        width: "190px",
        renderer({ cellData }) {



          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
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
        tableKey: `showClosingRankR2`,
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
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
        tableKey: `showClosingRankR3`,
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
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
        tableKey: `showStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null ) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
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
        tableKey: `showLastStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null ) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },



      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
          </div>
        ),
      tableKey: "showPrevClosingRankR1",
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
          </div>
        ),
       tableKey: "showPrevClosingRankR2",
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R3] ${previousYear}`}
          </div>
        ),
       tableKey: "showPrevClosingRankR3",
        width: "190px",
        renderer({ cellData }) {

          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          >
            {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          </div>
        ),
        tableKey: `showPrevStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          >
            Last {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          </div>
        ),
        tableKey: `showPrevLastStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },

      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      // { title: "State", tableKey: "state", width: "150px" },

      {
        title: "Fees",
        tableKey: "fees",
        width: "100px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
    ]

    return columns
  }

  function backURL() {
    return `/closing-ranks/${stateCode}?state=${state}&courseType=${courseType}&course=${courseParams}`
    // `/closing-ranks/${state.code.toLowerCase()}?state=${state.name}&courseType=${selectedType?.text}&&course=${selectedCourse?.text}
  }

  return (
    <FELayout>
      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            <Link
              href={backURL()}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {state} Colleges
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-color-table-header">
                  {searchParams.get("college")}
                </h1>
                <p className="text-gray-600">
                  NEET UG {prevYear} - {currentYear} Closing Ranks
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            <div className="justify-between items-center mb-10 hidden pc:flex">
              <div></div>
              <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
            </div>

            <ClosingRankGuide className="max-w-[900px] flex-shrink-0 pc:hidden" />

            <div
              className={cn(
                "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
              )}
            >
              <p className="animated-new text-center">
                Rotate your Phone to Landscape or Horizontal For Better view.
              </p>
            </div>

            <Table
              columns={generateCols()}
              data={tableData?.data}
              itemsCountPerPage={tableData?.pageSize}
            />

            <Pagination
              currentPage={tableData?.currentPage}
              totalItems={tableData?.totalItems}
              itemsCountPerPage={tableData?.pageSize}
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => {
                const closingRankCollege = getLocalStorageItem<any>(
                  paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                )

                fetchData({
                  url: "/api/closing_ranks",
                  method: "POST",
                  params: {
                    page,
                    size: 20,
                  },

                  data: { closingRankCollege,stateCode },
                }).then((data: any) => {
                  setTableData(data?.payload)
                })
              }}
            />
          </Container>
        </section>

        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            {/* Expert Guidance CTA */}
            <div className="mt-16 border border-color-accent rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Need personalized guidance?
                </h3>
                <p className="text-gray-600">
                  Connect with our expert counselors to get personalized college
                  recommendations based on your NEET rank and preferences.
                </p>
              </div>
              <Link
                href="https://wa.me/919028009835"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Book Counselling Session
              </Link>
            </div>
          </Container>
        </section>
      </div>
      <SignInPopup noRedirect />
    </FELayout>
  )
}

