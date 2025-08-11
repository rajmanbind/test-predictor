import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode==="all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`;
  }
  return "college_table_all_india"
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination parameters
  let page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")

  const paymentStatus = searchParams.get("paymentStatus") === "true"
  const stateCode = searchParams.get("stateCode")

const tableName = getTableName(stateCode)
  if (!paymentStatus) {
    page = 1
  }
console.log("Search data: ",searchParams)
  // Search and filter parameters
  const rank = parseInt(searchParams.get("rank") || "0")
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
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false })

  // Apply optional filters
  // if (states.length > 0) {
  //   query = query.in("state", states)
  // }
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

  // // Merge and filter records based on rank and domicileState
  const mergedData: any[] = []
  const recordMap = new Map()

  // data.forEach((record) => {
  //   const key = `${record.instituteName}-${record.instituteType}-${record.state}-${record.course}-${record.category}-${record.quota}`

  //   if (!recordMap.has(key)) {
  //     recordMap.set(key, { old: null, new: null })
  //   }

  //   if (Number(record.year) === Number(newerYear)) {
  //     recordMap.get(key).new = record
  //   } else {
  //     recordMap.get(key).old = record
  //   }
  // })

  // data.forEach((item) => {
  //   // const { old, new: latest } = value

  //   // Skip if both old and latest are null
  //   // if (!old && !latest) {
  //   //   return
  //   // }

  //   let shouldIncludeByRank: any = false

  //   if (rankType === "RANK"||rankType==="Rank") {
  //     shouldIncludeByRank =
  //       Number(rank) > 0
  //         ? 
  //             [
  //               item.lastStrayRound,
  //               item.strayRound,
  //               item.closingRankR3,
  //               item.closingRankR2,
  //               item.closingRankR1,
  //             ].some((rankVal) => cleanRanks(rankVal) && Number(rank) <= cleanRanks(rankVal))
  //         : true
  //   } else {

  //     shouldIncludeByRank =
  //       rank > 0
  //         ? [
  //             item.lSRR,
  //             item.sRR,
  //             item.cRR3,
  //             item.cRR2,
  //             item.cRR1,
  //           ].some((mark) => {
  //             const value = cleanMarks(mark)

  //             return rank >= value
  //           })
  //         : true
  //   }

  //   // Apply domicileState filter with rank check
  //   // const shouldIncludeByState =
  //   //   states.length > 0
  //   //     ? states.includes(latest?.state) || states.includes(old?.state)
  //   //     : true


  // console.log("Dlaksjhdf;la",shouldIncludeByRank,rankType)
  //   if (shouldIncludeByRank) {
  //     const record: any = {
  //        id: item.id,
  //   created_at : item.created_at,
  //   instituteType:item.instituteType,
  //   instituteName:item.instituteName,
  //   quota:item.quota,
  //   category:item.category,
  //   course:item.course,
  //   courseType:item.courseType,
  //   fees:item.fees,
  //   subQuota:item.subQuota,
  //   subCategory:item.subCategory,

  //              showClosingRankR1:(item.closingRankR1 ? `${item.closingRankR1}/${item.cRR1}` :null),
  //       showClosingRankR2:(item.closingRankR2 ? `${item.closingRankR2}/${item.cRR2}` :null),
  //       showClosingRankR3:(item.closingRankR3 ? `${item.closingRankR3}/${item.cRR3}` :null),
  //       showStrayRound: (item.strayRound ? `${item.strayRound }/${item.sRR}` :null),
  //       showLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.slRR}` :null),
        
  //       showPrevClosingRankR2:(item.prevClosingRankR1 ? `${item.prevClosingRankR1}/${item.prevCRR1}` :null),
  //       showPrevClosingRankR1:(item.prevClosingRankR2 ? `${item.prevClosingRankR2}/${item.prevCRR2}` :null),
  //       showPrevClosingRankR3:(item.prevClosingRankR3 ? `${item.prevClosingRankR3}/${item.prevCRR3}` :null),
  //       showPrevStrayRound: (item.strayRound ? `${item.strayRound}/${item.prevSRR}` :null),
  //       showPrevLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.prevlSRR}` :null),
       
  //       sortKey: Math.min(
  //         cleanRanks(item?.closingRankR1) || Infinity,
  //         cleanRanks(item?.closingRankR2) || Infinity,
  //         cleanRanks(item?.closingRankR3) || Infinity,
  //         cleanRanks(item?.strayRound) || Infinity,
  //         // !latest ? cleanRanks(old?.closingRankR1) || Infinity : Infinity,
  //         // !latest ? cleanRanks(old?.closingRankR2) || Infinity : Infinity,
  //         // !latest ? cleanRanks(old?.closingRankR3) || Infinity : Infinity,
  //         // !latest ? cleanRanks(old?.strayRound) || Infinity : Infinity,
  //       ),
  //     }

  //     mergedData.push(record)
  //   }
  // })

  // Sort records: prioritize domicileState matches first, then others, both sorted by rank
  // mergedData.sort((a, b) => {
  //   const aIsDomicileMatch = domicileState && a.state === domicileState
  //   const bIsDomicileMatch = domicileState && b.state === domicileState

  //   // Prioritize domicile matches
  //   if (aIsDomicileMatch && !bIsDomicileMatch) return -1
  //   if (!aIsDomicileMatch && bIsDomicileMatch) return 1

  //   // Within same domicile status, sort by sortKey (lowest rank first)
  //   return a.sortKey - b.sortKey
  // })

 const cleanData = data &&data.map(item=>
  ({
    id: item.id,
    created_at : item.created_at,
    instituteType:item.instituteType,
    instituteName:item.instituteName,
    quota:item.quota,
    category:item.category,
    course:item.course,
    courseType:item.courseType,
    fees:item.fees,
    subQuota:item.subQuota,
    subCategory:item.subCategory,

        showClosingRankR1:(item.closingRankR1 ? `${item.closingRankR1}/${item.cRR1}` :null),
        showClosingRankR2:(item.closingRankR2 ? `${item.closingRankR2}/${item.cRR2}` :null),
        showClosingRankR3:(item.closingRankR3 ? `${item.closingRankR3}/${item.cRR3}` :null),
        showStrayRound: (item.strayRound ? `${item.strayRound }/${item.sRR}` :null),
        showLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.slRR}` :null),
        
        showPrevClosingRankR2:(item.prevClosingRankR1 ? `${item.prevClosingRankR1}/${item.prevCRR1}` :null),
        showPrevClosingRankR1:(item.prevClosingRankR2 ? `${item.prevClosingRankR2}/${item.prevCRR2}` :null),
        showPrevClosingRankR3:(item.prevClosingRankR3 ? `${item.prevClosingRankR3}/${item.prevCRR3}` :null),
        showPrevStrayRound: (item.strayRound ? `${item.strayRound}/${item.prevSRR}` :null),
        showPrevLastStrayRound: (item.lastStrayRound ? `${item.lastStrayRound}/${item.prevlSRR}` :null),
       
      
    }))

  // if (!paymentStatus) {
  //   mergedData = mergedData.map((item) => ({
  //     ...item,
  //     showClosingRankR1: "xxx",
  //     showClosingRankR2: "xxx",
  //     showClosingRankR3: "xxx",
  //     showStrayRound: "xxx",
  //     showLastStrayRound: "xxx",
  //     // strayRound_new: "xxx",
  //     // finalStrayRound_old: "xxx",
  //     // finalStrayRound_new: "xxx",
  //     // lastStrayRound_old: "xxx",
  //     // lastStrayRound_new: "xxx",
  //   }))
  // }

  // Pagination
  const totalItems =cleanData&& cleanData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = cleanData.slice((page - 1) * pageSize, page * pageSize)

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

