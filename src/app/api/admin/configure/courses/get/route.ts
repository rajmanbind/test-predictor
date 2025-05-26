import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const subType = searchParams.get("subType")

    const supabase = createAdminSupabaseClient()

    let query = supabase
      .from("courses")
      .select("*")
      .order("text", { ascending: true })

    if (type) {
      query = query.eq("type", type)
    }

    if (subType) {
      query = query.eq("subType", subType)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { msg: "Failed to fetch data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}

