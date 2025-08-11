import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
console.log("State Code: ",stateCode)
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


    console.log("Received Data; ",body)
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    )
  }

  const college = body.closingRankCollege
  // console.log("BODY: ",body)
  const stateCode = body.stateCode
    const tableName = getTableName(stateCode)
  if (
    !college?.instituteName ||
    !college?.instituteType ||
    !college?.courseType 
  ) {
    return NextResponse.json(
      {
        error:
          "All fields (instituteName, instituteType, courseType) are required",
      },
      { status: 400 },
    )
  }

  const supabaseUser = createUserSupabaseClient()

  // // Get configured years
  // const { data: selectedYear, error: yearsError } = await supabaseUser
  //   .from("dropdown_options")
  //   .select("*")
  //   .eq("type", "CONFIG_YEAR")
  //   .single()

  // if (yearsError) {
  //   return NextResponse.json(
  //     {
  //       msg: "Failed to get year config",
  //       error: yearsError,
  //     },
  //     { status: 400 },
  //   )
  // }

  // const latestYears = selectedYear.text
  //   ?.split("-")
  //   .map((item: string) => item.trim())
  // const [olderYear, newerYear] = latestYears

  // let data: any[] = []
  // let count: number | null = 0

  // if (college?.courseType === "UG") {
    // Get total count
    // const { count: ugCount, data, error: countError } = await supabaseUser
    //   .from(tableName)
    //   .select("*", { count: "exact", head: true })
    //   .eq("instituteName", college.instituteName)
    //   // .eq("instituteType", college.instituteType)
    //   // .eq("course", college.course)

    // if (countError) {
    //   return NextResponse.json({ error: countError.message }, { status: 500 })
    // }

    // Fetch all data without pagination for merging
    const { data,error } = await supabaseUser
      .from(tableName)
      .select("*")
      .eq("instituteName", college.instituteName)
      // .eq("instituteType", college.instituteType)
      // .eq("course", college.course)
      // .eq("state", college.state)
      // .in("year", latestYears)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // data = ugData
    // count = ugCount
  // } else {
  //   const supabase = createAdminSupabaseClient()

  //   // const { data: courseData, error: courseError } = await supabase
  //   //   .from("courses")
  //   //   .select("*")
  //   //   .eq("subType", college.course)

  //   // const filterCourseList = courseData?.map((c: any) => c.text) ?? []

  //   // Get total count
  //   const { count: pgCount, error: countError } = await supabaseUser
  //     .from(tableName)
  //     .select("*", { count: "exact", head: true })
  //     .eq("instituteName", college.instituteName)
  //     .eq("instituteType", college.instituteType)
  //     .eq("courseType", college.courseType)
  //     // .in("course", filterCourseList)
  //     // .eq("state", college.state)

  //   if (countError) {
  //     return NextResponse.json({ error: countError.message }, { status: 500 })
  //   }

  //   // Fetch all data without pagination for merging
  //   const { data: pgData, error } = await supabaseUser
  //     .from(tableName)
  //     .select("*")
  //     .eq("instituteName", college.instituteName)
  //     .eq("instituteType", college.instituteType)
  //     .eq("courseType", college.courseType)
  //     // .in("course", filterCourseList)
  //     .order("created_at", { ascending: false })

  //   if (error) {
  //     return NextResponse.json({ error: error.message }, { status: 500 })
  //   }

  //   data = pgData
  //   count = pgCount
  // }

  // Merge records with updated key
  // const mergedData: any[] = []
  // const recordMap = new Map()

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

  // recordMap.forEach((value, key) => {
  //   const { old, new: latest } = value

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
  // })

  // Pagination
  const totalItems = cleanData?.length||0
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = cleanData.slice((page - 1) * pageSize, page * pageSize)
// console.log("Data: ",{
//     data: paginatedData,
//     currentPage: page,
//     pageSize,
//     totalItems,
//     totalPages,
//   })
  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}
