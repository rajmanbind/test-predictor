import { createSupabaseServerClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id
    const updateData = await request.json()

    if (!id) {
      return NextResponse.json(
        { msg: "ID is required for updating data" },
        { status: 400 },
      )
    }

    const supabase = createSupabaseServerClient()

    const { error, data } = await supabase
      .from("data_table")
      .update(updateData)
      .eq("id", id)
      .single()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to update data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Data updated successfully.", data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong!", error: err },
      { status: 400 },
    )
  }
}
