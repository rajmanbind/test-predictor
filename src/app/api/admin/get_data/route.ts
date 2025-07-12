import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const instituteName = searchParams.get("instituteName")

  const supabase = createAdminSupabaseClient()

  // Step 1: Get the selected year
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

  // Step 2: Build the query with pagination
  let query = supabase
    .from("college_table")
    .select("*", { count: "exact" }) // Include count for total rows
    .in("year", latestYears)
    .order("created_at", { ascending: false })

  if (instituteName) {
    query = query.ilike("instituteName", `%${instituteName}%`)
  }

  // Apply pagination at the database level
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  // Step 3: Merge records with updated key
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

    if (old || latest) {
      mergedData.push({
        prev_id: old?.id,
        new_id: latest?.id,
        created_at: latest?.created_at ?? old?.created_at,
        instituteName: latest?.instituteName ?? old?.instituteName,
        instituteType: latest?.instituteType ?? old?.instituteType,
        courseType: latest?.courseType ?? old?.courseType,
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
    }
  })

  // Step 4: Return paginated response
  const totalItems = count || mergedData.length
  const totalPages = Math.ceil(totalItems / pageSize)

  return NextResponse.json({
    data: mergedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}

