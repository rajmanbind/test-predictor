import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import StackedAreaChart from "@/components/admin-panel/dashboard/ChartAreaStacked"

export default function AdminDashboardPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <StackedAreaChart />
    </BELayout>
  )
}
