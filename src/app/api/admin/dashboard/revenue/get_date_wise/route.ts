import { createAdminSupabaseClient } from "@/lib/supabase"
import { format, subDays } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "0")

  if (![7, 30, 365].includes(days)) {
    return NextResponse.json(
      { error: "Invalid 'days' query param. Use 7, 30, or 365." },
      { status: 400 },
    )
  }

  const supabase = createAdminSupabaseClient()
  const fromDate = subDays(new Date(), days)

  const { data, error } = await supabase
    .from("payment")
    .select(
      "created_at, SINGLE_COLLEGE_CLOSING_RANK, STATE_CLOSING_RANK, PREMIUM_PLAN, COLLEGE_CUT_OFF, RANK_COLLEGE_PREDICTOR",
    )
    .gte("created_at", fromDate.toISOString())

  if (error) {
    return NextResponse.json(
      { msg: "Error fetching data", error },
      { status: 500 },
    )
  }

  const grouped: Record<string, number> = {}

  for (const row of data) {
    const date = format(new Date(row.created_at), "yyyy-MM-dd")
    const total =
      (row.SINGLE_COLLEGE_CLOSING_RANK || 0) +
      (row.STATE_CLOSING_RANK || 0) +
      (row.PREMIUM_PLAN || 0) +
      (row.COLLEGE_CUT_OFF || 0) +
      (row.RANK_COLLEGE_PREDICTOR || 0)

    grouped[date] = (grouped[date] || 0) + total
  }

  const result = Array.from({ length: days }).map((_, index) => {
    const dateObj = subDays(new Date(), days - 1 - index)
    const key = format(dateObj, "yyyy-MM-dd")
    return {
      date: dateObj.toString(), // gives "Mon May 12 2025 17:52:32 GMT+0530 (India Standard Time)"
      revenue: grouped[key] || 0,
    }
  })

  return NextResponse.json(result)
}

