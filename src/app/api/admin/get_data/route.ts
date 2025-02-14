import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10) - 1
    const size = parseInt(searchParams.get("size") || "10", 10)
    const from = page * size
    const to = from + size - 1

    const supabase = createSupabaseServerClient()

    const { data, error, count } = await supabase
      .from("data_table")
      .select("*", { count: "exact" })
      .range(from, to)

    if (error) {
      return NextResponse.json(
        { msg: "Failed to fetch data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({
      data,
      page: page + 1,
      size,
      total: count,
      totalPages: Math.ceil((count || 0) / size),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
