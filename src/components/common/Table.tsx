import { cn, isEmpty } from "@/utils/utils"
import React, { useEffect, useState } from "react"

export interface TableColumn {
  title: string
  tableKey: string
  width?: string
  overrideInternalClick?: boolean
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
  className?: string
  onChange?: (selectedRows: any[]) => void
}

const headerTHClass =
  "border-b border-color-border px-4 py-3 text-left text-color-black_white font-medium text-sm"

export function Table({
  selectable,
  hideSLNo,
  columns,
  className,
  data,
  onChange,
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  useEffect(() => {
    setSelectedRows(new Set())
    onChange?.([])
  }, [data])

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
    <div className={cn("relative", className)}>
      {isEmpty(data) && (
        <div className="defaultTextStyles font-normal absolute top-1/2 left-1/2 -translate-x-1/2">
          No Data Available...
        </div>
      )}
      <div
        className={cn(
          "overflow-x-auto border rounded-lg border-color-border relative min-h-[600px]",
        )}
      >
        <table className="min-w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-color-table-header">
              {selectable && (
                <th
                  className={cn(
                    "border-b border-color-border p-3 tableCheckboxStatic bg-color-table-header",
                  )}
                >
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
                  "hover:bg-color-table-header cursor-pointer group",
                  data?.length - 1 <= rowIndex
                    ? "border-b border-color-border"
                    : "border-b border-color-border",
                )}
                onClick={() => handleSelectRow(rowIndex)}
              >
                {selectable && (
                  <td className="p-3 bg-color-form-background tableCheckboxStatic group-hover:bg-color-table-header">
                    <input
                      className="translate-y-[2px]"
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                    />
                  </td>
                )}
                {!hideSLNo && (
                  <td className="p-3 text-left text-xs">{rowIndex + 1}</td>
                )}
                {columns?.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-4 py-3 text-left text-xs",
                      column?.overrideInternalClick && "cursor-auto",
                    )}
                    onClick={(e) =>
                      column?.overrideInternalClick ? e.stopPropagation() : null
                    }
                  >
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
    </div>
  )
}
