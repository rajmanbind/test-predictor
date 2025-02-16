import { BELayout } from "@/components/admin-panel/BELayout"
import RevenueAnalyticsChart from "@/components/admin-panel/dashboard/RevenueAnalyticsChart"
import UserAnalyticsChart from "@/components/admin-panel/dashboard/UserAnalyticsChart"
import UserTable from "@/components/admin-panel/dashboard/UserTable"

export default function AdminDashboardPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <div className="flex flex-col tab:flex-row gap-6">
        <RevenueAnalyticsChart />
        <UserAnalyticsChart />
      </div>

      <UserTable />
    </BELayout>
  )
}
