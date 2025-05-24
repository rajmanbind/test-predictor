"use client"

import { Button } from "@/components/common/Button"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { paymentType, years } from "@/utils/static"
import { getLocalStorageItem, onPageChange } from "@/utils/utils"
import { ChevronLeft, Info, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function StateClosingRanksPage() {
  const [tableData, setTableData] = useState<any>(null)

  const [year, setYear] = useState(2024)

  const params = useParams()
  const state = decodeURIComponent(params.state as any)
  const { getSearchParams } = useInternalSearchParams()

  const { fetchData } = useFetch()

  useEffect(() => {
    const closingRankCollege = getLocalStorageItem<any>(
      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
    )

    setYear(closingRankCollege?.year)

    getData(closingRankCollege)
  }, [])

  async function getData(closingRankCollege: any) {
    const page = Number(getSearchParams("page") || 1)

    const res = await fetchData({
      method: "POST",
      url: "/api/closing_ranks",
      params: {
        page,
        size: 20,
      },
      data: {
        closingRankCollege,
      },
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  function generateCols() {
    const percentile_Marks = params.id === "ug" ? "Marks" : "Percentile"

    const currentYear = year

    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
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
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
          </div>
        ),
        tableKey: `closingRankR1`,
        width: "130px",
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
        tableKey: `closingRankR2`,
        width: "130px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "-"}
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
        tableKey: `closingRankR3`,
        width: "130px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "-"}
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
        tableKey: `strayRound`,
        width: "110px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "-"}
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
        tableKey: `lastStrayRound`,
        width: "110px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "-"}
            </div>
          )
        },
      },
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
              {cellData ?? "-"}
            </div>
          )
        },
      },
    ]

    return columns
  }

  return (
    <FELayout>
      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            <Link
              href={`/closing-ranks/${params.id}/${state}`}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {params?.state} Colleges
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-color-table-header">
                  {getSearchParams("college")}
                </h1>
                <p className="text-gray-600">NEET UG {year} Closing Ranks</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
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

                  data: { closingRankCollege },
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
            <div className="mt-16 bg-gradient-to-r from-yellow-50 to-emerald-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
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

