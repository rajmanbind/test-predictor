import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

type AppendType = "plan" | "state" | "college"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const {
      phone_no,
      value,
      type,
    }: { phone_no: string; value: string | string[]; type: AppendType } =
      await request.json()

    // Check for missing parameters
    if (!phone_no || !value || !type) {
      return NextResponse.json(
        { msg: "Missing phone_no, value, or type" },
        { status: 400 },
      )
    }

    // Mapping append types to respective functions
    const rpcMap: Record<AppendType, { fn: string; arg: string }> = {
      plan: { fn: "append_user_plan", arg: "plan" },
      state: { fn: "append_user_state", arg: "state" },
      college: { fn: "append_user_college", arg: "colleges" }, // updated argument name
    }

    // Get the function and argument name based on the type
    const { fn, arg } = rpcMap[type]

    // Initialize Supabase client
    const supabase = createAdminSupabaseClient()

    // Prepare data: ensure value is always an array
    const valueArray = Array.isArray(value) ? value : [value]

    // Log the data being sent to Supabase
    console.log("Calling RPC:", fn, {
      phone: phone_no,
      [arg]: valueArray,
    })

    // Call the Supabase function (RPC)
    const { error, data } = await supabase.rpc(fn, {
      phone: phone_no,
      [arg]: valueArray,
    })

    // Log the response from Supabase
    console.log("Supabase Response:", error, data)

    // Handle error if Supabase returns one
    if (error) {
      return NextResponse.json(
        { msg: `Failed to append to ${type}`, error },
        { status: 400 },
      )
    }

    // Return success message
    return NextResponse.json({
      msg: `${type} appended successfully`,
    })
  } catch (err) {
    // Catch unexpected errors
    console.error(err)
    return NextResponse.json(
      { msg: "Something went wrong", err },
      { status: 500 },
    )
  }
}
