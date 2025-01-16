"use client"

import { Card } from "@/components/common/Card"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table"
import { Container } from "@/components/frontend/Container"
import { FE_Layout } from "@/components/frontend/FE_Layout"

const columns: TableColumn[] = [
  { title: "Name", tableKey: "name", maxWidth: "400px" },
  { title: "Age", tableKey: "age", maxWidth: "100px" },
  {
    title: "Action",
    tableKey: "action",
    renderer: ({ rowData, cellData }) => (
      <button
        className="bg-red-600"
        onClick={() => alert(`Clicked on ${rowData.name}'s Action`)}
      >
        Click Me
      </button>
    ),
  },
]

const data = [
  { name: "John Doe", age: 30, action: "123 Main St" },
  {
    name: "Vardhman Mahavir Medical College & Safdarjung Hospital, Delhi	",
    age: 25,
    action: "456 Elm St",
  },
  { name: "Jane Smith", age: 25, action: "456 Elm St" },
]

export default function ResultPage() {
  return (
    <FE_Layout>
      <Container className="py-16 pc:py-20">
        <Card className="mt-10">
          <Table columns={columns} data={data} />
          <Pagination
            currentPage={1}
            totalItems={100}
            wrapperClass="pb-[50px]"
            onPageChange={(page: number) => {
              console.log(page)
            }}
          />
        </Card>
      </Container>
    </FE_Layout>
  )
}
