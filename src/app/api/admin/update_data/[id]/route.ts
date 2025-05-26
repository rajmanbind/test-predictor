import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

const na = ["NA", "N/A"]

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

    const supabase = createAdminSupabaseClient()

    updateData.cRR1 = na.includes(updateData?.closingRankR1.toUpperCase())
      ? null
      : updateData?.cRR1

    updateData.cRR2 = na.includes(updateData?.closingRankR2.toUpperCase())
      ? null
      : updateData?.cRR2

    updateData.cRR3 = na.includes(updateData?.closingRankR3.toUpperCase())
      ? null
      : updateData?.cRR3

    updateData.sRR = na.includes(updateData?.strayRound.toUpperCase())
      ? null
      : updateData?.sRR

    updateData.lSRR = na.includes(updateData?.lastStrayRound.toUpperCase())
      ? null
      : updateData?.lSRR

    const { error, data } = await supabase
      .from("college_table")
      .update(updateData)
      .eq("id", id)
      .select()

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

