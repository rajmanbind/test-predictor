"use client"

import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { Filter } from "@/components/frontend/college-predictore/Filter"
import { SearchForm } from "@/components/frontend/college-predictore/SearchForm"
import { tempData } from "@/components/frontend/college-predictore/temp"

const columns: TableColumn[] = [
  {
    title: "Institute",
    tableKey: "institute",
    width: "200px",
  },
  { title: "Institute Type", tableKey: "institute_type" },
  { title: "State", tableKey: "state" },
  {
    title: "Course",
    tableKey: "course",
  },
  {
    title: "Quota",
    tableKey: "quota",
  },
  { title: "Category", tableKey: "category" },
  { title: "Closing Rank 2023", tableKey: "closing_rank" },
  { title: "Fee", tableKey: "fee" },
]

export default function ResultPage() {
  return (
    <FELayout>
      <Container className="py-10">
        <h2 className="text-color-text text-3xl pb-6">
          NEET Collage Predictor
        </h2>

        <SearchForm />

        <div className="mt-10 bg-color-form-background flex items-start py-4 rounded-lg pr-3">
          <Filter className="p-3 flex-shrink-0 w-[300px]" />

          <div
            className="flex-1 pl-3 border-l border-color-border"
            style={{
              overflowX: "auto",
            }}
          >
            <Table columns={columns} data={tempData} />

            <Pagination
              currentPage={1}
              totalItems={100}
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => {}}
            />
          </div>
        </div>
      </Container>
    </FELayout>
  )
}
