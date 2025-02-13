import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const supabase = createSupabaseServerClient()

    const { error } = await supabase.from("data_table").insert(data)

    if (error) {
      return NextResponse.json(
        { msg: "Failed to insert data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({ data, msg: "Data inserted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
