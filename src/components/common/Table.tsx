import { cn } from "@/utils/utils"
import React from "react"

export interface TableColumn {
  title: string
  tableKey: string
  maxWidth?: string
  renderer?: (props: {
    rowData: TableRow
    cellData: React.ReactNode
  }) => React.ReactNode
}

interface TableRow {
  [key: string]: React.ReactNode
}

interface TableProps {
  columns: TableColumn[]
  data: TableRow[]
  hideSLNo?: boolean
}

const headerTHClass =
  "border-b border-color-border px-4 py-3 text-left text-color-black_white font-medium text-sm"

export function Table({ hideSLNo, columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto border rounded-lg border-color-border">
      <table
        className="min-w-full border-collapse table-fixed"
        style={{
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr className="bg-color-table-header">
            {!hideSLNo && (
              <th
                className={headerTHClass}
                style={{
                  maxWidth: "8px",
                  width: "8px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                #
              </th>
            )}

            {columns.map((column, index) => (
              <th
                key={index}
                className={headerTHClass}
                style={{
                  maxWidth: column.maxWidth,
                  width: column.maxWidth,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-color-table-header transition-colors duration-200",
                "border-b border-color-border",
                rowIndex >= data?.length - 1 &&
                  "border-b-none  border-transparent",
              )}
            >
              {!hideSLNo && (
                <td
                  className={cn("px-4 py-3 text-left text-xs font-normal")}
                  style={{
                    maxWidth: "8px",
                    width: "8px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    color: "var(--text-sub-color)",
                  }}
                >
                  {rowIndex + 1}
                </td>
              )}

              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("px-4 py-3 text-left text-xs font-normal")}
                  style={{
                    maxWidth: column.maxWidth,
                    width: column.maxWidth,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    color: "var(--text-sub-color)",
                  }}
                >
                  {column.renderer
                    ? column.renderer({
                        rowData: row,
                        cellData: row[column.tableKey],
                      })
                    : row[column.tableKey] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
