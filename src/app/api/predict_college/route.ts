import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination parameters
  let page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")

  const paymentStatus = searchParams.get("paymentStatus") === "true"

  if (!paymentStatus) {
    page = 1
  }

  // Search and filter parameters
  const rank = parseInt(searchParams.get("rank") || "0")
  const domicileState = searchParams.get("domicileState") || ""
  const states = searchParams.get("states")?.split(",") || []
  const courses = searchParams.get("course")?.split(",") || []
  const categories = searchParams.get("category")?.split(",") || []
  const instituteTypes = searchParams.get("instituteType")?.split(",") || []
  const quotas = searchParams.get("quota")?.split(",") || []
  const feeFrom = parseInt(searchParams.get("feeFrom") || "0")

  const rankType = searchParams.get("rankType")?.toString()?.toUpperCase()

  const courseType = searchParams.get("courseType")?.toString()?.toUpperCase()

  const feeToRaw = searchParams.get("feeTo")
  const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw)

  const isAllCourses = courses.includes(`All ${courseType} Courses`)

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
  if (states.length > 0) {
    query = query.in("state", states)
  }
  if (courses.length > 0 && !isAllCourses) query = query.in("course", courses)

  if (isAllCourses) {
    query = query.eq("courseType", courseType)
  }

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

  // Merge and filter records based on rank and domicileState
  let mergedData: any[] = []
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

    // Skip if both old and latest are null
    if (!old && !latest) {
      return
    }

    let shouldIncludeByRank: any = false

    if (rankType === "RANK") {
      shouldIncludeByRank =
        rank > 0
          ? (latest &&
              [
                latest.lastStrayRound,
                latest.strayRound,
                latest.closingRankR3,
                latest.closingRankR2,
                latest.closingRankR1,
              ].some(
                (rankVal) => cleanRanks(rankVal) && rank <= cleanRanks(rankVal),
              )) ||
            (!latest &&
              old &&
              [
                old.lastStrayRound,
                old.strayRound,
                old.closingRankR3,
                old.closingRankR2,
                old.closingRankR1,
              ].some(
                (rankVal) => cleanRanks(rankVal) && rank <= cleanRanks(rankVal),
              ))
          : true
    } else {
      const marksToCheck = latest ?? old

      shouldIncludeByRank =
        rank > 0
          ? marksToCheck &&
            [
              marksToCheck.lSRR,
              marksToCheck.sRR,
              marksToCheck.cRR3,
              marksToCheck.cRR2,
              marksToCheck.cRR1,
            ].some((mark) => {
              const value = cleanMarks(mark)

              return rank >= value
            })
          : true
    }

    // Apply domicileState filter with rank check
    const shouldIncludeByState =
      states.length > 0
        ? states.includes(latest?.state) || states.includes(old?.state)
        : true

    if (shouldIncludeByRank) {
      const record: any = {
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
        sortKey: Math.min(
          cleanRanks(latest?.closingRankR1) || Infinity,
          cleanRanks(latest?.closingRankR2) || Infinity,
          cleanRanks(latest?.closingRankR3) || Infinity,
          cleanRanks(latest?.strayRound) || Infinity,
          !latest ? cleanRanks(old?.closingRankR1) || Infinity : Infinity,
          !latest ? cleanRanks(old?.closingRankR2) || Infinity : Infinity,
          !latest ? cleanRanks(old?.closingRankR3) || Infinity : Infinity,
          !latest ? cleanRanks(old?.strayRound) || Infinity : Infinity,
        ),
      }

      mergedData.push(record)
    }
  })

  // Sort records: prioritize domicileState matches first, then others, both sorted by rank
  mergedData.sort((a, b) => {
    const aIsDomicileMatch = domicileState && a.state === domicileState
    const bIsDomicileMatch = domicileState && b.state === domicileState

    // Prioritize domicile matches
    if (aIsDomicileMatch && !bIsDomicileMatch) return -1
    if (!aIsDomicileMatch && bIsDomicileMatch) return 1

    // Within same domicile status, sort by sortKey (lowest rank first)
    return a.sortKey - b.sortKey
  })

  if (!paymentStatus) {
    mergedData = mergedData.map((item) => ({
      ...item,
      closingRankR2_old: "xxx",
      closingRankR3_old: "xxx",
      strayRound_old: "xxx",
      closingRankR2_new: "xxx",
      closingRankR3_new: "xxx",
      strayRound_new: "xxx",
      finalStrayRound_old: "xxx",
      finalStrayRound_new: "xxx",
      lastStrayRound_old: "xxx",
      lastStrayRound_new: "xxx",
    }))
  }

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

function cleanRanks(ranks: string): number {
  return Number(ranks) || 0
}

function cleanMarks(marks: any): number {
  const value = Number(marks)
  return isNaN(value) || value <= 0 ? Infinity : value
}

