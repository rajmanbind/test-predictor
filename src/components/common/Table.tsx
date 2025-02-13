import { cn, isEmpty } from "@/utils/utils"
import React, { useState } from "react"

export interface TableColumn {
  title: string
  tableKey: string
  width?: string
  renderer?: (props: {
    rowData: any
    cellData: React.ReactNode
  }) => React.ReactNode
}

interface TableProps {
  columns: TableColumn[]
  data: any[]
  hideSLNo?: boolean
  selectable?: boolean
  onChange?: (selectedRows: any[]) => void
}

const headerTHClass =
  "border-b border-color-border px-4 py-3 text-left text-color-black_white font-medium text-sm"

export function Table({
  selectable,
  hideSLNo,
  columns,
  data,
  onChange,
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows)
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index)
    } else {
      newSelectedRows.add(index)
    }
    setSelectedRows(newSelectedRows)
    onChange?.(Array.from(newSelectedRows).map((i) => data[i]))
  }

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
      onChange?.([])
    } else {
      const allSelected = new Set(data.map((_, index) => index))
      setSelectedRows(allSelected)
      onChange?.(data)
    }
  }

  return (
    <div
      className={cn(
        "overflow-x-auto border rounded-lg border-color-border relative",
        isEmpty(data) && " h-52",
      )}
    >
      {isEmpty(data) && (
        <div className="flex justify-center items-center defaultTextStyles font-normal absolute top-[54%] left-1/2 -translate-x-1/2 ">
          No Data Available...
        </div>
      )}

      <table className="min-w-full border-collapse table-fixed">
        <thead>
          <tr className="bg-color-table-header">
            {selectable && (
              <th className={cn("border-b border-color-border p-3")}>
                <input
                  className="translate-y-[2px]"
                  type="checkbox"
                  checked={
                    selectedRows?.size === data?.length && !isEmpty(data)
                  }
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {!hideSLNo && <th className={cn(headerTHClass, "px-3")}>#</th>}
            {columns?.map((column, index) => (
              <th
                key={index}
                className={headerTHClass}
                style={{ minWidth: column?.width }}
              >
                {column?.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-color-table-header",
                data?.length - 1 <= rowIndex
                  ? ""
                  : "border-b border-color-border",
              )}
            >
              {selectable && (
                <td className={cn("p-3")}>
                  <input
                    className="translate-y-[2px]"
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => handleSelectRow(rowIndex)}
                  />
                </td>
              )}
              {!hideSLNo && (
                <td className="p-3 text-left text-xs">{rowIndex + 1}</td>
              )}
              {columns?.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-left text-xs">
                  {column?.renderer
                    ? column?.renderer({
                        rowData: row,
                        cellData: row[column?.tableKey],
                      })
                    : row[column?.tableKey] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
