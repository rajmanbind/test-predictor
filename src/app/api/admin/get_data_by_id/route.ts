import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ msg: "ID is required" }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from("data_table")
      .select("*")
      .eq("id", id)
      .select()

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
      { msg: "Something went wrong!", err },
      { status: 400 },
    )
  }
}
