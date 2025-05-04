import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Define the type for merged records including sortKey
interface MergedRecord {
  prev_id: any
  new_id: any
  created_at: any
  instituteName: any
  instituteType: any
  state: any
  course: any
  quota: any
  category: any
  fees: any
  closingRankR1_old: any
  closingRankR2_old: any
  closingRankR3_old: any
  strayRound_old: any
  closingRankR1_new: any
  closingRankR2_new: any
  closingRankR3_new: any
  strayRound_new: any
  year: any
  sortKey: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")

  // Search and filter parameters
  const rank = parseInt(searchParams.get("rank") || "0")
  const states = searchParams.get("states")?.split(",") || []
  const courses = searchParams.get("course")?.split(",") || []
  const categories = searchParams.get("category")?.split(",") || []
  const instituteTypes = searchParams.get("instituteType")?.split(",") || []
  const quotas = searchParams.get("quota")?.split(",") || []
  const feeFrom = parseInt(searchParams.get("feeFrom") || "0")

  const feeToRaw = searchParams.get("feeTo")
  const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw)

  const supabase = createAdminSupabaseClient()

  // Get configured years
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
      },
      { status: 400 },
    )
  }

  const latestYears = selectedYear.text
    ?.split("-")
    .map((item: string) => item.trim())
  const [olderYear, newerYear] = latestYears

  // Fetch data with initial filters
  let query = supabase
    .from("college_table")
    .select("*")
    .in("year", latestYears)
    .order("created_at", { ascending: false })

  // Apply optional filters
  if (states.length > 0) query = query.in("state", states)
  if (courses.length > 0) query = query.in("course", courses)
  if (categories.length > 0) query = query.in("category", categories)
  if (instituteTypes.length > 0)
    query = query.in("instituteType", instituteTypes)
  if (quotas.length > 0) query = query.in("quota", quotas)

  if (feeFrom || feeTo !== Infinity) {
    query = query.gte("fees", feeFrom).lte("fees", feeTo)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  // Merge and filter records based on rank
  const mergedData: MergedRecord[] = []
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

    // Define rank check order
    const shouldInclude =
      rank > 0
        ? (latest?.strayRound && rank <= latest.strayRound) ||
          (latest?.closingRankR3 && rank <= latest.closingRankR3) ||
          (latest?.closingRankR2 && rank <= latest.closingRankR2) ||
          (latest?.closingRankR1 && rank <= latest.closingRankR1) ||
          (!latest && old?.strayRound && rank <= old.strayRound) ||
          (!latest && old?.closingRankR3 && rank <= old.closingRankR3) ||
          (!latest && old?.closingRankR2 && rank <= old.closingRankR2) ||
          (!latest && old?.closingRankR1 && rank <= old.closingRankR1)
        : true

    if (shouldInclude) {
      const record: MergedRecord = {
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
        sortKey: Math.min(
          latest?.strayRound || Infinity,
          latest?.closingRankR3 || Infinity,
          latest?.closingRankR2 || Infinity,
          latest?.closingRankR1 || Infinity,
          !latest ? old?.strayRound || Infinity : Infinity,
          !latest ? old?.closingRankR3 || Infinity : Infinity,
          !latest ? old?.closingRankR2 || Infinity : Infinity,
          !latest ? old?.closingRankR1 || Infinity : Infinity,
        ),
      }

      mergedData.push(record)
    }
  })

  // Sort by lowest rank first
  mergedData.sort((a, b) => a.sortKey - b.sortKey)

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
