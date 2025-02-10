import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        {
          msg: "Logout failed",
          isAuthenticated: true,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      msg: "Logout successful",
      isAuthenticated: false,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
