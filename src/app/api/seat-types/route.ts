// // import { NextResponse } from "next/server"
// // import { createAdminSupabaseClient } from "@/lib/supabase"

// // export async function GET() {
// //   const supabase = createAdminSupabaseClient()

// //   const { data, error } = await supabase.from("seat_types").select("*")

// //   if (error) {
// //     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
// //   }

// //   return NextResponse.json({ success: true, data })
// // }


// // app/api/seat-types/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { createAdminSupabaseClient } from "@/lib/supabase"

// export async function GET(request: NextRequest) {
//   const supabase = createAdminSupabaseClient()

//   const { searchParams } = new URL(request.url)
//   const counsellingTypeId = searchParams.get("counselling_type_id")
//   const stateId = searchParams.get("state_id") // optional
// console.log("from Server: ",stateId,counsellingTypeId)
//   if (!counsellingTypeId) {
//     return NextResponse.json({ success: false, error: "Missing counselling_type_id" }, { status: 400 })
//   }

//   const query = supabase
//     .from("seat_types")
//     .select("*")
//     .eq("counselling_type_id", counsellingTypeId)

//   if (stateId) {
//     query.eq("state_id", stateId) // Filter by state only if provided
//   }

//   const { data, error } = await query

//   if (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }

//   return NextResponse.json({ success: true, data })
// }


import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)
  const counsellingTypeId = searchParams.get("counselling_type_id")
  const stateId = searchParams.get("state_id")

  console.log("From Server - State ID:", stateId, "Counselling Type ID:", counsellingTypeId)

  if (!counsellingTypeId) {
    return NextResponse.json({ success: false, error: "Missing counselling_type_id" }, { status: 400 })
  }

  let query = supabase
    .from("seat_types")
    .select("*")
    .eq("counselling_type_id", counsellingTypeId)

  if (stateId) {
    query = query.eq("state_id", stateId) // ✅ fix: reassign chained query
  }

  const { data, error } = await query

  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
