import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const instituteName = searchParams.get("instituteName")?.trim()
  const courseType = searchParams.get("courseType")?.trim()
  const dataCheckMode = searchParams.get("dataCheckMode")
  const state = searchParams.get("state")

  const supabase = createAdminSupabaseClient()

  const { data: selectedYear, error: yearsError } = await supabase
    .from("dropdown_options")
    .select("*")
    .eq("type", "CONFIG_YEAR")
    .single()

  if (yearsError) {
    return NextResponse.json(
      {
        msg: "Failed to get year config",
        error: yearsError,
        data: selectedYear,
      },
      { status: 400 },
    )
  }

  const latestYears = selectedYear.text
    ?.split("-")
    .map((item: string) => item.trim())

  const query = supabase
    .from("college_table")
    .select("*")
    .in("year", latestYears)
    .eq("instituteName", instituteName)
    .eq("courseType", courseType)
    .eq("state", state)

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  if (dataCheckMode) {
    const hasData = data?.length > 0
    return NextResponse.json({ hasData })
  }

  // Merge records
  const mergedData: any[] = []
  const recordMap = new Map()

  data.forEach((record) => {
    const key = `${record.instituteName}-${record.instituteType}-${record.state}-${record.course}-${record.category}-${record.quota}`

    if (!recordMap.has(key)) {
      recordMap.set(key, { old: null, new: null })
    }

    if (Number(record.year) === Math.max(...latestYears)) {
      recordMap.get(key).new = record
    } else {
      recordMap.get(key).old = record
    }
  })

  recordMap.forEach((value, key) => {
    const { old, new: latest } = value

    mergedData.push({
      prev_id: old?.id,
      new_id: latest?.id,
      created_at: latest?.created_at ?? old?.created_at,
      instituteName: latest?.instituteName ?? old?.instituteName,
      instituteType: latest?.instituteType ?? old?.instituteType,
      state: latest?.state ?? old?.state,
      course: latest?.course ?? old?.course,
      quota: latest?.quota ?? old?.quota,
      category: latest?.category ?? old?.category,
      fees: latest?.fees ?? old?.fees,
      closingRankR1_old:
        old?.closingRankR1 + (old?.cRR1 ? `/ ${old?.cRR1}` : ""),
      closingRankR2_old:
        old?.closingRankR2 + (old?.cRR2 ? `/ ${old?.cRR2}` : ""),
      closingRankR3_old:
        old?.closingRankR3 + (old?.cRR3 ? `/ ${old?.cRR3}` : ""),
      strayRound_old: old?.strayRound + (old?.sRR ? `/ ${old?.sRR}` : ""),
      lastStrayRound_old:
        old?.lastStrayRound + (old?.lSRR ? `/ ${old?.lSRR}` : ""),
      closingRankR1_new:
        latest?.closingRankR1 + (latest?.cRR1 ? `/ ${latest?.cRR1}` : ""),
      closingRankR2_new:
        latest?.closingRankR2 + (latest?.cRR2 ? `/ ${latest?.cRR2}` : ""),
      closingRankR3_new:
        latest?.closingRankR3 + (latest?.cRR3 ? `/ ${latest?.cRR3}` : ""),
      strayRound_new:
        latest?.strayRound + (latest?.sRR ? `/ ${latest?.sRR}` : ""),
      lastStrayRound_new:
        latest?.lastStrayRound + (latest?.lSRR ? `/ ${latest?.lSRR}` : ""),
      year:
        old?.year && latest?.year
          ? `${old.year} - ${latest.year}`
          : (old?.year ?? latest?.year),
    })
  })

  // Return all merged data
  return NextResponse.json({
    data: mergedData,
  })
}

