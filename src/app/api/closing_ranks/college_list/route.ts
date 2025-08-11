import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { isExpired } from "@/utils/utils"
import { addMonths, isBefore, parseISO } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode==='all')
     return `college_table_all_india`;
    return `college_table_${stateCode.toUpperCase()}`;
  }
  return "college_table_all_india"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const state = searchParams.get("state")?.trim()
  const courseType = searchParams.get("courseType")?.trim()
  const course = searchParams.get("course")?.trim()
  const stateCode = searchParams.get("stateCode")?.trim()
  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }

  if (pageSize > 100) {
    return NextResponse.json(
      { error: "pageSize cannot exceed 100" },
      { status: 400 },
    )
  }

  const supabase = createAdminSupabaseClient()

  // Get configured years
  // const { data: selectedYear, error: yearsError } = await supabase
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

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const tableName = getTableName(stateCode)
  // if (courseType&& courseType.includes("UG")) {
    // const { data, error } = await supabase.rpc("get_grouped_colleges", {
    //   // year_array: latestYears,
    //   course_type: courseType,
    // })

    // console.log("Table Name; ",tableName,courseType)
// const {data,error} = await supabase.from(tableName)
// .select("*")
// .eq("courseType",courseType)
//  .ilike("courseType", courseType!);
// .eq("course",course)

const { data, error } = await supabase.rpc("get_unique_colleges_data", {
  table_name: tableName,
  course_type: courseType,
})

if (error) {
  console.error("Supabase  error:", error.message)
  return NextResponse.json(
    { error: "Failed to fetch grouped colleges", details: error.message },
    { status: 500 },
  )
}

// console.log("Data : ",data)
    // for (let i = 0; i < data?.length; i++) {
    //   data[i].year = selectedYear.text
    // }

    // Filter by state if provided
    // const filteredData =data.filter(
    //       (item: any) =>
    //         item.state=== state&&
    //         item.course === course,
    //     )
 

    const res = await checkPurchases(
      data,
      // filteredData,
      from,
      to,
      state,
      page,
      pageSize,
      course,
      courseType,
    )
    return NextResponse.json(res)
  // } else {
  //   const { data: courseData, error: courseError } = await supabase
  //     .from("courses")
  //     .select("*")
  //     .eq("subType", course)

    // const filterCourseList = courseData?.map((c) => c.text) ?? []

    // const { data: collegeData, error: collegeError } = await supabase.rpc(
    //   "get_distinct_colleges_by_institute",
    //   {
    //     // p_state: state,
    //     // p_years: latestYears,
    //     p_courses: filterCourseList,
    //   },
    // )

    // for (let i = 0; i < collegeData?.length; i++) {
    //   collegeData[i].instituteName = collegeData?.[i].institutename
    //   collegeData[i].instituteType = collegeData?.[i].institutetype
    //   // collegeData[i].year = selectedYear.text
    //   delete collegeData?.[i].institutename
    //   delete collegeData?.[i].institutetype
    // }

    // const res = await checkPurchases(
    //   collegeData,
    //   from,
    //   to,
    //   state,
    //   page,
    //   pageSize,
    //   filterCourseList,
    //   courseType,
    // )
  //   return NextResponse.json(courseData)
  // }
}

async function checkPurchases(
  data: any[],
  from: number,
  to: number,
  state: any,
  page: number,
  pageSize: number,
  coursesList: any,
  courseType: any,
) {
  const supabaseUser = createUserSupabaseClient()

  const paginated = data?.slice(from, to + 1)
  const totalItems = data?.length
  const totalPages = Math.ceil(totalItems / pageSize)

  let hiddenData = paginated

  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  if (user) {
    const { data: userPurchases, error: purchasesError } = await supabaseUser
      .from("purchase")
      .select("*")
      .eq("phone", user.phone)
// console.log("Purchage Details: ",userPurchases)
    if (purchasesError) {
      console.error("Supabase error:", purchasesError.message)
      return NextResponse.json(
        {
          error: "Failed to fetch user purchases",
          details: purchasesError.message,
        },
        { status: 500 },
      )
    }

    const timeZone = "Asia/Kolkata"
    const currentDate = toZonedTime(new Date(), timeZone)

    // let hasValidPremiumPlan = false

    // const hasUGPurchased = userPurchases.some(
    //   (purchase: any) =>
    //     purchase.plans === "UG Package" && !isExpired(purchase.created_at, 6),
    // )

    // const hasPGPurchased = userPurchases.some(
    //   (purchase: any) =>
    //     purchase.plans === "PG Package" && !isExpired(purchase.created_at, 6),
    // )

    // if (courseType && courseType.includes("UG") && hasUGPurchased) {
    //   hasValidPremiumPlan = true
    // } else if (courseType && courseType.includes("PG") && hasPGPurchased) {
    //   hasValidPremiumPlan = true
    // }

    // if (hasValidPremiumPlan) {
    //   hiddenData = paginated

    //   for (let i = 0; i < hiddenData.length; i++) {
    //     hiddenData[i].purchased = true
    //     hiddenData[i].statePurchased = true
    //   }
    // } else {
//       const justForTest = userPurchases.filter((purchase) => {
//         const purchase_state = purchase?.closing_rank_details?.state
//         const purchase_courseType = purchase?.closing_rank_details?.courseType

//         const purchaseDate = parseISO(purchase.created_at)
//         const expiryDate = addMonths(purchaseDate, 6)

//             console.log("Purchage Data: ",purchase)
// return purchase.payment_type==="STATE_CLOSING_RANK"
//         return (
//           purchase.payment_type === "STATE_CLOSING_RANK" &&
//           purchase_courseType === courseType &&
//           purchase_state === state &&
//           isBefore(currentDate, expiryDate)
//         )
//       })
// console.log("Just for Test: ",justForTest)
      const hasValidStatePurchase = userPurchases.some((purchase) => {
        const purchase_state = purchase?.closing_rank_details?.state
        const purchase_courseType = purchase?.closing_rank_details?.courseType

        const purchaseDate = parseISO(purchase.created_at)
        const expiryDate = addMonths(purchaseDate, 6)

            // console.log("Purchage Data: ",purchase)

        return (
          (purchase.payment_type === "STATE_CLOSING_RANK" ||  purchase.payment_type === "ALL_INDIA_CLOSING_RANK") &&
          purchase_courseType === courseType &&
          purchase_state === state &&
          isBefore(currentDate, expiryDate)
        )
      })

//       console.log("hasValidStatePurchase: ",hasValidStatePurchase)
      if (hasValidStatePurchase) {
        hiddenData = paginated
        for (let i = 0; i < hiddenData.length; i++) {
          hiddenData[i].purchased = true
          hiddenData[i].statePurchased = true
        }
      } else {
        hiddenData = hiddenData.map((college: any) => {
          const matchingPurchase = userPurchases.find((p) => {
            const purchaseDate = parseISO(p.created_at)
            const expiryDate = addMonths(purchaseDate, 6)

            return (
              p.payment_type === "SINGLE_COLLEGE_CLOSING_RANK" &&
              isBefore(currentDate, expiryDate) &&
              isCollegePurchased(college, p.closing_rank_details)
            )
          })

          return matchingPurchase ? { ...college, purchased: true } : college
        })
      }
    // }
  }

  return {
    data: hiddenData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  }
}

function isCollegePurchased(college: any, userCollege: any) {
  const { instituteName, instituteType, courseType } = userCollege

    return (
      college.instituteName === instituteName &&
      college.instituteType === instituteType &&
      college.courseType ===courseType
    )
}

