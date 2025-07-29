// app/api/category-types/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)
  const seatTypeId = searchParams.get("seat_type_id")

  if (!seatTypeId) {
    return NextResponse.json({ success: false, error: "Missing seat_type_id" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("category_types")
    .select("*")
    .eq("seat_type_id", seatTypeId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
