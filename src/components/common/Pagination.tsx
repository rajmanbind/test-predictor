"use client"

import { cn, updateQueryParams } from "@/utils/utils"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import React, { forwardRef, useEffect, useImperativeHandle } from "react"
import ReactJsPagination from "react-js-pagination"

interface PaginationProps {
  currentPage: number
  totalItems: number | undefined
  pageRangeDisplayed?: number
  itemsCountPerPage?: number
  onPageChange: (page: number) => void
  wrapperClass?: string
  showOnlyOnePage?: boolean
}

// Define the ref type for the imperative handle
export interface PaginationHandle {
  setActivePage: (page: number) => void
}

export const Pagination = forwardRef<PaginationHandle, PaginationProps>(
  (
    {
      currentPage = 1,
      totalItems = 0,
      itemsCountPerPage = 10,
      onPageChange,
      wrapperClass,
      showOnlyOnePage,
    },
    ref,
  ) => {
    const [activePage, setActivePage] = React.useState(currentPage)
    const router = useRouter()

    // Expose setActivePage to the parent via ref
    useImperativeHandle(ref, () => ({
      setActivePage: (page: number) => {
        setActivePage(page)
      },
    }))

    useEffect(() => {
      setActivePage(currentPage)
    }, [currentPage])

    function handlePageChange(pageNumber: number) {
      updateQueryParams(router, { page: pageNumber })
      setActivePage(pageNumber)
      onPageChange(pageNumber)
    }

    function calcShowing() {
      if (activePage * itemsCountPerPage > totalItems) {
        return totalItems
      }
      return activePage * itemsCountPerPage
    }

    return (
      <div
        className={cn(
          "pt-[16px] xl:pt-[18px] pb-16 tab:flex justify-between items-center w-full",
          wrapperClass,
        )}
      >
        <ReactJsPagination
          activePage={activePage}
          onChange={handlePageChange}
          totalItemsCount={showOnlyOnePage ? 1 : totalItems || 1}
          pageRangeDisplayed={5}
          itemsCountPerPage={itemsCountPerPage}
          innerClass="flex"
          itemClass="size-[32px] text-color-text cursor-pointer text-[12px] font-normal grid place-items-center hover:bg-color-accent/40 rounded-full"
          activeClass="!bg-color-table-header !text-color-text !rounded-full"
          disabledClass="opacity-50 !cursor-not-allowed"
          itemClassFirst="rounded-tl-sm rounded-bl-sm"
          itemClassLast="rounded-tr-sm rounded-br-sm"
          firstPageText={
            <ChevronFirst
              className="!text-color-subtext"
              size={22}
              strokeWidth={1.5}
            />
          }
          prevPageText={
            <ChevronLeft
              className="!text-color-subtext"
              size={22}
              strokeWidth={1.5}
            />
          }
          nextPageText={
            <ChevronRight
              className="!text-color-subtext"
              size={22}
              strokeWidth={1.5}
            />
          }
          lastPageText={
            <ChevronLast
              className="!text-color-subtext"
              size={22}
              strokeWidth={1.5}
            />
          }
        />

        <p className="text-xs text-color-subtext tab:pr-3 pl-2 tab:pl-0 pt-4">{`Showing ${calcShowing()} of ${totalItems} results`}</p>
      </div>
    )
  },
)

Pagination.displayName = "Pagination"
