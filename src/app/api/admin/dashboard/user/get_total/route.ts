import { createAdminSupabaseClient } from "@/lib/supabase"
import { startOfMonth } from "date-fns"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminSupabaseClient()

  // Total count
  const { count: totalUsers, error: totalError } = await supabase
    .from("user")
    .select("*", { count: "exact", head: true })

  if (totalError) {
    return NextResponse.json(
      { msg: "Error fetching total user count", error: totalError },
      { status: 500 },
    )
  }

  // This month's count
  const monthStart = startOfMonth(new Date()).toISOString()

  const { count: monthlyUsers, error: monthError } = await supabase
    .from("user")
    .select("*", { count: "exact", head: true })
    .gte("created_at", monthStart)

  if (monthError) {
    return NextResponse.json(
      { msg: "Error fetching monthly user count", error: monthError },
      { status: 500 },
    )
  }

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    thisMonthUsers: monthlyUsers || 0,
  })
}

