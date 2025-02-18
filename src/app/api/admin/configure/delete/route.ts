import { createSupabaseServerClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    const supabase = createSupabaseServerClient()

    const { error, data } = await supabase
      .from("dropdown_options")
      .delete()
      .eq("id", id)
      .single()

    if (error || isEmpty(data))
      return NextResponse.json(
        { msg: "Failed to delete", error },
        { status: 400 },
      )

    return NextResponse.json({ msg: "Deleted successfully" })
  } catch (err) {
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 400 },
    )
  }
}
