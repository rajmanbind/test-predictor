import { createSupabaseServerClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const instituteName = searchParams.get("instituteName")?.trim()
  const dataCheckMode = searchParams.get("dataCheckMode")

  // Check if instituteName is provided
  if (!instituteName) {
    return NextResponse.json(
      {
        error: "instituteName parameter is required",
      },
      { status: 400 },
    )
  }

  const supabase = createSupabaseServerClient()

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

  // Step 2: Fetch data for merging with required instituteName filter
  const { data, error } = await supabase
    .from("college_table")
    .select("*")
    .in("year", latestYears)
    .ilike("instituteName", `%${instituteName}%`)
    .order("created_at", { ascending: false })

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  if (dataCheckMode) {
    const hasData = data?.length > 0

    return NextResponse.json({
      hasData,
    })
  }

  // Step 3: Merge records
  const mergedData: any[] = []
  const recordMap = new Map()

  data.forEach((record) => {
    const key = `${record.instituteName}-${record.instituteType}-${record.course}-${record.category}`

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
      closingRankR1_old: old?.closingRankR1,
      closingRankR2_old: old?.closingRankR2,
      closingRankR3_old: old?.closingRankR3,
      strayRound_old: old?.strayRound,
      closingRankR1_new: latest?.closingRankR1,
      closingRankR2_new: latest?.closingRankR2,
      closingRankR3_new: latest?.closingRankR3,
      strayRound_new: latest?.strayRound,
      year:
        old?.year && latest?.year
          ? `${old.year} - ${latest.year}`
          : (old?.year ?? latest?.year),
    })
  })

  // Step 4: Pagination
  const totalItems = mergedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = mergedData.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}
