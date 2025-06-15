import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    )
  }

  const college = body.closingRankCollege

  if (
    !college?.instituteName ||
    !college?.instituteType ||
    !college?.courseType ||
    !college?.state
  ) {
    return NextResponse.json(
      {
        error:
          "All fields (instituteName, instituteType, courseType, state) are required",
      },
      { status: 400 },
    )
  }

  const supabaseUser = createUserSupabaseClient()

  // Get configured years
  const { data: selectedYear, error: yearsError } = await supabaseUser
    .from("dropdown_options")
    .select("*")
    .eq("type", "CONFIG_YEAR")
    .single()

  if (yearsError) {
    return NextResponse.json(
      {
        msg: "Failed to get year config",
        error: yearsError,
      },
      { status: 400 },
    )
  }

  const latestYears = selectedYear.text
    ?.split("-")
    .map((item: string) => item.trim())
  const [olderYear, newerYear] = latestYears

  let data: any[] = []
  let count: number | null = 0

  if (college?.courseType === "UG") {
    // Get total count
    const { count: ugCount, error: countError } = await supabaseUser
      .from("college_table")
      .select("*", { count: "exact", head: true })
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("course", college.course)
      .eq("state", college.state)
      .in("year", latestYears)

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // Fetch all data without pagination for merging
    const { data: ugData, error } = await supabaseUser
      .from("college_table")
      .select("*")
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("course", college.course)
      .eq("state", college.state)
      .in("year", latestYears)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    data = ugData
    count = ugCount
  } else {
    const supabase = createAdminSupabaseClient()

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("subType", college.course)

    const filterCourseList = courseData?.map((c: any) => c.text) ?? []

    // Get total count
    const { count: pgCount, error: countError } = await supabaseUser
      .from("college_table")
      .select("*", { count: "exact", head: true })
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .in("course", filterCourseList)
      .eq("state", college.state)
      .in("year", latestYears)

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // Fetch all data without pagination for merging
    const { data: pgData, error } = await supabaseUser
      .from("college_table")
      .select("*")
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .in("course", filterCourseList)
      .eq("state", college.state)
      .in("year", latestYears)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    data = pgData
    count = pgCount
  }

  // Merge records with updated key
  const mergedData: any[] = []
  const recordMap = new Map()

  data.forEach((record) => {
    const key = `${record.instituteName}-${record.instituteType}-${record.state}-${record.course}-${record.category}-${record.quota}`

    if (!recordMap.has(key)) {
      recordMap.set(key, { old: null, new: null })
    }

    if (Number(record.year) === Number(newerYear)) {
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

  // Pagination
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
