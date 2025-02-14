import { createSupabaseServerClient } from "@/lib/supabase"
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

    const { error } = await supabase
      .from("data_table")
      .update(updateData)
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        { msg: "Failed to update data", error, updateData },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Data updated successfully.", updateData })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong!", error: err },
      { status: 400 },
    )
  }
}
