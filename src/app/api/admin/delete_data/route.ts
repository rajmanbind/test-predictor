import { createSupabaseServerClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    const supabase = createSupabaseServerClient()

    const { error, data } = await supabase
      .from("college_table")
      .delete()
      .in("id", id)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to delete record", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Record deleted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
