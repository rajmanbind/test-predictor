import { BELayout } from "@/components/admin-panel/BELayout"
import RevenueAnalyticsChart from "@/components/admin-panel/dashboard/RevenueAnalyticsChart"
import UserAnalyticsChart from "@/components/admin-panel/dashboard/UserAnalyticsChart"
import UserTable from "@/components/admin-panel/dashboard/UserTable"
import { Card } from "@/components/common/Card"
import { IndianRupee } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <div className="flex items-center justify-between pc:justify-end gap-6 mb-6 text-color-text text-xs tab:text-sm pc:text-base">
        <Card className="w-[300px] space-y-2">
          <div className="flex items-center justify-between">
            Monthly Revenue:
            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">50,000</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            Total Revenue:
            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">150,000</span>
            </div>
          </div>
        </Card>
        <Card className="w-[300px] space-y-2">
          <div className="flex items-center justify-between">
            Monthly Reg. User:
            <p className="font-semibold">5,000</p>
          </div>
          <div className="flex items-center justify-between">
            Total Reg. User:
            <p className="font-semibold">17,000</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col tab:flex-row gap-6">
        <RevenueAnalyticsChart />
        <UserAnalyticsChart />
      </div>

      <UserTable />
    </BELayout>
  )
}
