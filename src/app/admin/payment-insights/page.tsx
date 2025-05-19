"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import RevenueAnalyticsChart from "@/components/admin-panel/dashboard/RevenueAnalyticsChart"
import { Card } from "@/components/common/Card"
import useFetch from "@/hooks/useFetch"
import { IndianRupee } from "lucide-react"
import { useEffect, useState } from "react"

export default function PaymentInsightsPage() {
  const { fetchData } = useFetch()

  const [revenue, setRevenue] = useState({
    monthlyRevenue: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchData({ url: `/api/admin/dashboard/revenue/get_total` }).then(
      (revenueRes) => {
        setRevenue({
          monthlyRevenue: revenueRes?.payload?.monthlyRevenue || 0,
          totalRevenue: revenueRes?.payload?.totalRevenue || 0,
        })
      },
    )
  }, [])

  return (
    <BELayout className="mb-10 tab:mb-0">
      <div className="flex items-center justify-between pc:justify-end gap-6 mb-6 text-color-text text-xs tab:text-sm pc:text-base">
        <Card className="w-[300px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Monthly Revenue:</div>
            <div className="block tab:hidden">
              Monthly <br /> Revenue:
            </div>
            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">{revenue?.monthlyRevenue}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Total Revenue:</div>
            <div className="block tab:hidden">
              Total <br /> Revenue:
            </div>

            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">{revenue?.totalRevenue}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col tab:flex-row gap-6">
        <RevenueAnalyticsChart />
      </div>
    </BELayout>
  )
}

