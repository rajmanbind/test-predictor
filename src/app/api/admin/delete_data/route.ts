import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    const supabase = createSupabaseServerClient()

    const { error } = await supabase.from("data_table").delete().in("id", id)

    if (error) {
      return NextResponse.json(
        { msg: "Failed to delete data", error },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Data deleted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
