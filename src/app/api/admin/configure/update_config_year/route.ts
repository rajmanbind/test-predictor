import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    const supabase = createAdminSupabaseClient()

    // Check if CONFIG_YEAR exists
    const { data: existingData, error: fetchError } = await supabase
      .from("dropdown_options")
      .select("id")
      .eq("type", "CONFIG_YEAR")
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json(
        { msg: "Failed to fetch existing CONFIG_YEAR", error: fetchError },
        { status: 400 },
      )
    }

    if (existingData) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from("dropdown_options")
        .update({ text })
        .eq("id", existingData.id)

      if (updateError) {
        return NextResponse.json(
          { msg: "Failed to update CONFIG_YEAR", error: updateError },
          { status: 400 },
        )
      }

      return NextResponse.json({ msg: "Configuration updated successfully" })
    } else {
      // Insert new entry
      const { error: insertError } = await supabase
        .from("dropdown_options")
        .insert({ type: "CONFIG_YEAR", text })

      if (insertError) {
        return NextResponse.json(
          { msg: "Failed to insert CONFIG_YEAR", error: insertError },
          { status: 400 },
        )
      }

      return NextResponse.json({ msg: "Configuration updated successfully" })
    }
  } catch (err) {
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 400 },
    )
  }
}
