import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { msg: "Invalid input. Expected a non-empty array." },
        { status: 400 },
      )
    }

    const supabase = createSupabaseServerClient()

    const { error } = await supabase.from("dropdown_options").insert(data)

    if (error) {
      return NextResponse.json(
        { msg: "Failed to insert data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({
      data,
      msg: "Dropdown options added successfully.",
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
