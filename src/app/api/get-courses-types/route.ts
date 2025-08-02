import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from("course_type_and_courses")
    .select("id, type, text") 

  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 200 })
}
