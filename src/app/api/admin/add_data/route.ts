import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"

const na = ["NA", "N/A"]

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json()
    const supabase = createAdminSupabaseClient()

    const {
      instituteName,
      instituteType,
      state,
      course,
      quota,
      category,
      year,
    } = reqData

    // Check existing data without .single() to debug
    const { data: checkData, error: checkError } = await supabase
      .from("college_table")
      .select("*")
      .eq("instituteName", instituteName)
      .eq("instituteType", instituteType)
      .eq("state", state)
      .eq("course", course)
      .eq("quota", quota)
      .eq("category", category)
      .eq("year", Number(year))

    if (checkError) {
      console.error("Check query error:", checkError)
      return NextResponse.json(
        { msg: "Error checking data", error: checkError },
        { status: 400 },
      )
    }

    if (checkData?.length > 0) {
      return NextResponse.json(
        { msg: "The Data Already Exists!" },
        { status: 400 },
      )
    }

    // If data already exists, you might want to handle it differently
    if (checkData && checkData.length > 0) {
      return NextResponse.json(
        { msg: "Data already exists", data: checkData },
        { status: 200 },
      )
    }

    reqData.cRR1 = na.includes(reqData?.closingRankR1.toUpperCase())
      ? null
      : reqData?.cRR1

    reqData.cRR2 = na.includes(reqData?.closingRankR2.toUpperCase())
      ? null
      : reqData?.cRR2

    reqData.cRR3 = na.includes(reqData?.closingRankR3.toUpperCase())
      ? null
      : reqData?.cRR3

    reqData.sRR = na.includes(reqData?.strayRound.toUpperCase())
      ? null
      : reqData?.sRR

    reqData.lSRR = na.includes(reqData?.lastStrayRound.toUpperCase())
      ? null
      : reqData?.lSRR

    // Insert new data
    const { error, data } = await supabase
      .from("college_table")
      .insert(reqData)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to insert data", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ data, msg: "Data inserted successfully." })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}

