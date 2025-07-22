"use client"

import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"

interface IBackupData {
  college_table_last_inserted: string
  courses_last_inserted: string
  dropdown_options_last_inserted: string
  payment_last_inserted: string
  price_last_inserted: string
  purchase_last_inserted: string
  user_last_inserted: string
}

function BackupPage() {
  const { fetchData } = useFetch()

  const [backupData, setBackupData] = useState<IBackupData>()

  useEffect(() => {
    fetchBackupData()
  }, [])

  async function fetchBackupData() {
    const data = await fetchData({ url: "/api/admin/backup" })
    setBackupData(data?.payload)
  }

  return (
    <div className="p-4">
      <table className="max-w-[400px] w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Table
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Last Inserted
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">College Table</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.college_table_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Courses</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.courses_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Dropdown Options
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.dropdown_options_last_inserted || "-"}
            </td>
          </tr>

          <tr>
            <td className="border border-gray-300 px-4 py-2">
              --------------------
            </td>
            <td className="border border-gray-300 px-4 py-2">
              --------------------
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Payment</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.payment_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Price</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.price_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Purchase</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.purchase_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">User</td>
            <td className="border border-gray-300 px-4 py-2">
              {backupData?.user_last_inserted || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default BackupPage

