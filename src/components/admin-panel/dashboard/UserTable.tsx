"use client"

import { Card } from "@/components/common/Card"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import React from "react"

const columns: TableColumn[] = [
  {
    title: "Joined On",
    tableKey: "createdAt",
    width: "120px",
  },
  {
    title: "Mobile Number",
    tableKey: "mobileNumber",
    width: "150px",
  },
  {
    title: "Payment Status",
    tableKey: "paymentStatus",
    renderer: ({ cellData }) => {
      if (cellData === "Paid") {
        return (
          <div className="bg-green-500/80 text-white rounded-full px-2 py-1 w-[120px] text-center">
            Paid
          </div>
        )
      } else {
        return (
          <div className="bg-red-500/80 text-white rounded-full px-2 py-1 w-[120px] text-center">
            Unpaid
          </div>
        )
      }
    },
  },
]

const data = [
  {
    createdAt: "02-Feb-2023",
    mobileNumber: "+91 987689434343",
    paymentStatus: "Paid",
  },
  {
    createdAt: "15-Mar-2023",
    mobileNumber: "+91 876543219876",
    paymentStatus: "Paid",
  },
  {
    createdAt: "20-Apr-2023",
    mobileNumber: "+91 912345678901",
    paymentStatus: "Unpaid",
  },
  {
    createdAt: "05-May-2023",
    mobileNumber: "+91 998877665544",
    paymentStatus: "Paid",
  },
  {
    createdAt: "12-Jun-2023",
    mobileNumber: "+91 934567890123",
    paymentStatus: "Unpaid",
  },
  {
    createdAt: "25-Jul-2023",
    mobileNumber: "+91 945612378909",
    paymentStatus: "Paid",
  },
  {
    createdAt: "30-Aug-2023",
    mobileNumber: "+91 923456789012",
    paymentStatus: "Unpaid",
  },
  {
    createdAt: "10-Sep-2023",
    mobileNumber: "+91 965432187654",
    paymentStatus: "Paid",
  },
  {
    createdAt: "12-Jun-2023",
    mobileNumber: "+91 934567890123",
    paymentStatus: "Unpaid",
  },
  {
    createdAt: "25-Jul-2023",
    mobileNumber: "+91 945612378909",
    paymentStatus: "Paid",
  },
]

function UserTable() {
  return (
    <Card className="mt-6 py-6 px-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Total Registered Users
      </h2>

      <Table columns={columns} data={data} />

      <Pagination
        currentPage={1}
        totalItems={10}
        onPageChange={(page: number) => {}}
        wrapperClass="pb-0"
      />
    </Card>
  )
}

export default UserTable
