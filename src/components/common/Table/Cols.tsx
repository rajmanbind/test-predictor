import { TableColumn } from "@/components/common/Table/Table"
import { Copy, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { isEmpty } from "../../../utils/utils"

interface adminMode {
  isAdmin: boolean
  setRowData: React.Dispatch<React.SetStateAction<any>>
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSingleDelete: React.Dispatch<React.SetStateAction<any[]>>
}

export function generateCols(
  configYear: any[],
  adminMode?: adminMode,
  showToast?: any,
) {
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
          data-tooltip-content={`Closing Rank/ Marks Round 1 ${currentYear}`}
        >
          Closing Rank/ Marks [R1] {currentYear}
        </div>
      ),
      tableKey: `closingRankR1_new`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ Marks Round 2 ${currentYear}`}
        >
          Closing Rank/ Marks [R2] {currentYear}
        </div>
      ),
      tableKey: `closingRankR2_new`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ Marks Round 3 ${currentYear}`}
        >
          Closing Rank/ Marks [R3] {currentYear}
        </div>
      ),
      tableKey: `closingRankR3_new`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ Marks ${currentYear}`}
        >
          Stray Round Rank/ Marks {currentYear}
        </div>
      ),
      tableKey: `strayRound_new`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ Marks ${currentYear}`}
        >
          Last Stray Round Rank/ Marks {currentYear}
        </div>
      ),
      tableKey: `lastStrayRound_new`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },

    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ Marks Round 1 ${previousYear}`}
        >
          Closing Rank/ Marks [R1] {previousYear}
        </div>
      ),
      tableKey: `closingRankR1_old`,
      width: "185px",
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ Marks Round 2 ${previousYear}`}
        >
          Closing Rank/ Marks [R2] {previousYear}
        </div>
      ),
      tableKey: `closingRankR2_old`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ Marks Round 3 ${previousYear}`}
        >
          Closing Rank/ Marks [R3] {previousYear}
        </div>
      ),
      tableKey: `closingRankR3_old`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ Marks ${previousYear}`}
        >
          Stray Round Rank/ Marks {previousYear}
        </div>
      ),
      tableKey: `strayRound_old`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ Marks ${previousYear}`}
        >
          Last Stray Round Rank/ Marks {previousYear}
        </div>
      ),
      tableKey: `lastStrayRound_old`,
      width: "185px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    },

    { title: "Institute Type", tableKey: "instituteType", width: "150px" },
    { title: "State", tableKey: "state", width: "150px" },
    { title: "Fees", tableKey: "fees", width: "100px" },
  ]

  if (adminMode?.isAdmin) {
    const { setRowData, setPopupOpen, setSingleDelete } = adminMode

    const actions = {
      title: "Action",
      tableKey: "action",
      overrideInternalClick: true,
      width: "70px",
      renderer: ({ rowData }: any) => {
        if (rowData?.new_id && rowData?.prev_id) {
          return (
            <div className="flex items-center gap-2 bg-color-form-background px-4 py-5">
              <Copy
                size={20}
                className="text-color-text cursor-pointer"
                onClick={() => {
                  const link = `https://www.collegecutoff.net/${rowData?.courseType?.toString()?.toLowerCase()}/cutoff?college=${encodeURIComponent(rowData?.instituteName ?? "")}&state=${encodeURIComponent(rowData?.state ?? "")}`

                  copyToClipboard(link)
                  showToast?.("success", "Copied to clipboard")
                }}
              />
              <Pencil
                size={20}
                className="text-color-text cursor-pointer"
                onClick={() => {
                  setRowData(rowData)
                }}
              />

              <Trash2
                size={20}
                className="text-color-text cursor-pointer"
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
          <div className="flex items-center gap-2 bg-color-form-background px-4 py-5">
            <Copy
              size={20}
              className="text-color-text cursor-pointer"
              onClick={() => {
                const link = `https://www.collegecutoff.net/${rowData?.courseType?.toString()?.toLowerCase()}/cutoff?college=${encodeURIComponent(rowData?.instituteName ?? "")}&state=${encodeURIComponent(rowData?.state ?? "")}`

                copyToClipboard(link)
                showToast?.("success", "Copied to clipboard")
              }}
            />

            <Link href={`/admin/edit-data/${id}`} target="_blank">
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
    }

    columns.push(actions)
  }

  return columns
}

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern clipboard API
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed" // Prevent scrolling to bottom
    textArea.style.top = "-1000px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
    } catch (err) {
      console.error("Fallback copy failed:", err)
    }

    document.body.removeChild(textArea)
  }
}

export function generateColsPublic(
  configYear: any[],
  details?: { paid?: boolean; course_ug_pg?: string },
) {
  let currentYear = new Date().getFullYear()
  let previousYear = currentYear - 1

  let paid, course_ug_pg

  if (details) {
    paid = details?.paid
    course_ug_pg = details?.course_ug_pg
  }

  const percentile_Marks = course_ug_pg === "ug" ? "Marks" : "Percentile"

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
    // {
    //   title: (
    //     <div
    //       data-tooltip-id="tooltip"
    //       data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
    //     >
    //       {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
    //     </div>
    //   ),
    //   tableKey: `closingRankR1_new`,
    //   width: "190px",
    //   renderer({ cellData }) {
    //     return cellData === "undefined" || cellData === "null" ? "-" : cellData
    //   },
    // },
  ]

  if (paid) {
    // columns.push(
    //   {
    //     title: (
    //       <div
    //         data-tooltip-id="tooltip"
    //         data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
    //       >
    //         {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
    //       </div>
    //     ),
    //     tableKey: `closingRankR2_new`,
    //     width: "190px",
    //     renderer({ cellData }) {
    //       return cellData === "undefined" || cellData === "null"
    //         ? "-"
    //         : cellData
    //     },
    //   },
    //   {
    //     title: (
    //       <div
    //         data-tooltip-id="tooltip"
    //         data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
    //       >
    //         {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
    //       </div>
    //     ),
    //     tableKey: `closingRankR3_new`,
    //     width: "190px",
    //     renderer({ cellData }) {
    //       return cellData === "undefined" || cellData === "null"
    //         ? "-"
    //         : cellData
    //     },
    //   },
    //   {
    //     title: (
    //       <div
    //         data-tooltip-id="tooltip"
    //         data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
    //       >
    //         {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
    //       </div>
    //     ),
    //     tableKey: `strayRound_new`,
    //     width: "190px",
    //     renderer({ cellData }) {
    //       return cellData === "undefined" || cellData === "null"
    //         ? "-"
    //         : cellData
    //     },
    //   },
    //   {
    //     title: (
    //       <div
    //         data-tooltip-id="tooltip"
    //         data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
    //       >
    //         Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
    //       </div>
    //     ),
    //     tableKey: `lastStrayRound_new`,
    //     width: "190px",
    //     renderer({ cellData }) {
    //       return cellData === "undefined" || cellData === "null"
    //         ? "-"
    //         : cellData
    //     },
    //   },
    // )

    columns.push({
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
        </div>
      ),
      tableKey: `closingRankR1_old`,
      width: "190px",
      renderer({ cellData }) {
        return cellData === "undefined" || cellData === "null" ? "-" : cellData
      },
    })

    if (paid) {
      columns.push(
        {
          title: (
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
            >
              {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
            </div>
          ),
          tableKey: `closingRankR2_old`,
          width: "190px",
          renderer({ cellData }) {
            return cellData === "undefined" || cellData === "null"
              ? "-"
              : cellData
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
          tableKey: `closingRankR3_old`,
          width: "190px",
          renderer({ cellData }) {
            return cellData === "undefined" || cellData === "null"
              ? "-"
              : cellData
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
          tableKey: `strayRound_old`,
          width: "190px",
          renderer({ cellData }) {
            return cellData === "undefined" || cellData === "null"
              ? "-"
              : cellData
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
          tableKey: `lastStrayRound_old`,
          width: "190px",
          renderer({ cellData }) {
            return cellData === "undefined" || cellData === "null"
              ? "-"
              : cellData
          },
        },
      )
    }

    columns.push(
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      { title: "State", tableKey: "state", width: "150px" },
      { title: "Fees", tableKey: "fees", width: "100px" },
    )
  }

  return columns
}

