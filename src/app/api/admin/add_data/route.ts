import { createSupabaseServerClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()

    const supabase = createSupabaseServerClient()

    const { error, data } = await supabase
      .from("data_table")
      .insert(reqData)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error, data },
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
