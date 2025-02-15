import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { id, text } = await request.json()
    const supabase = createSupabaseServerClient()

    const { error } = await supabase
      .from("dropdown_options")
      .update({ text })
      .eq("id", id)

    if (error)
      return NextResponse.json(
        { msg: "Failed to update", error },
        { status: 400 },
      )

    return NextResponse.json({ msg: "Updated successfully" })
  } catch (err) {
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 400 },
    )
  }
}
