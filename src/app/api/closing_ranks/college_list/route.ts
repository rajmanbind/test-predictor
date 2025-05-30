import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { courseType, paymentType } from "@/utils/static"
import { addMonths, isBefore, parseISO } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const state = searchParams.get("state")?.trim()
  const year = searchParams.get("year")?.trim()
  const courseType = searchParams.get("courseType")?.trim()
  const course = searchParams.get("course")?.trim()

  if (page < 1 || pageSize < 1) {
    return NextResponse.json(
      { error: "Page and pageSize must be positive integers" },
      { status: 400 },
    )
  }
  if (!year || isNaN(parseInt(year))) {
    return NextResponse.json(
      { error: "Valid year is required" },
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

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  if (courseType === "UG") {
    // Use the RPC
    const { data, error } = await supabase.rpc("get_grouped_colleges", {
      target_year: year,
      course_type: courseType,
    })

    if (error) {
      console.error("Supabase RPC error:", error.message)
      return NextResponse.json(
        { error: "Failed to fetch grouped colleges", details: error.message },
        { status: 500 },
      )
    }

    // Filter by state if provided
    const filteredData = state
      ? data.filter(
          (item: any) =>
            item.state?.toLowerCase() === state.toLowerCase() &&
            item.course === course,
        )
      : data

    const res = await checkPurchases(
      filteredData,
      from,
      to,
      state,
      page,
      pageSize,
      course,
      courseType,
    )
    return NextResponse.json(res)
  } else {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("subType", course)

    const filterCourseList = courseData?.map((c) => c.text) ?? []

    // const { data: collegeData, error: collegeError } = await supabase
    //   .from("college_table")
    //   .select("*")
    //   .eq("state", state)
    //   .eq("year", year)
    //   .in("course", filterCourseList)
    //   .order("instituteName", { ascending: true })

    const { data: collegeData, error: collegeError } = await supabase.rpc(
      "get_distinct_colleges_by_institute",
      {
        p_state: state,
        p_year: parseInt(year),
        p_courses: filterCourseList,
      },
    )

    for (let i = 0; i < collegeData.length; i++) {
      collegeData[i].instituteName = collegeData?.[i].institutename
      collegeData[i].instituteType = collegeData?.[i].institutetype
      delete collegeData?.[i].institutename
      delete collegeData?.[i].institutetype
    }

    const res = await checkPurchases(
      collegeData,
      from,
      to,
      state,
      page,
      pageSize,
      filterCourseList,
      courseType,
    )
    return NextResponse.json(res)
  }
}

async function checkPurchases(
  filteredData: any[],
  from: number,
  to: number,
  state: any,
  page: number,
  pageSize: number,
  coursesList: any,
  courseType: any,
) {
  const supabaseUser = createUserSupabaseClient()

  // Manual pagination
  const paginated = filteredData.slice(from, to + 1)
  const totalItems = filteredData.length
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

    // Premium Plan Check
    if (userPurchases && userPurchases.length > 0 && paginated.length > 0) {
      const currentDate = new Date()

      const hasValidPremiumPlan = userPurchases.some((purchase) => {
        const purchaseDate = parseISO(purchase.created_at)
        const expiryDate = addMonths(purchaseDate, 6)
        return (
          purchase.payment_type === paymentType.PREMIUM_PLAN &&
          isBefore(currentDate, expiryDate)
        )
      })

      if (hasValidPremiumPlan) {
        hiddenData = paginated
      } else {
        // State Plan Check
        const hasValidStatePurchase = userPurchases.some((purchase) => {
          const purchase_state = purchase?.closing_rank_details?.state
          const purchase_courseType = purchase?.closing_rank_details?.courseType

          const purchaseDate = parseISO(purchase.created_at)
          const expiryDate = addMonths(purchaseDate, 6)

          return (
            purchase.payment_type === "STATE_CLOSING_RANK" &&
            purchase_courseType === courseType &&
            purchase_state === state &&
            isBefore(currentDate, expiryDate)
          )
        })

        if (hasValidStatePurchase) {
          hiddenData = paginated

          for (let i = 0; i < hiddenData.length; i++) {
            hiddenData[i].purchased = true
            hiddenData[i].statePurchased = true
          }
        } else {
          // Single College Plan Check of UG and PG particularly state
          hiddenData = hiddenData.map((college: any) => {
            const matchingPurchase = userPurchases.find((p) => {
              const purchaseDate = parseISO(p.created_at)
              const expiryDate = addMonths(purchaseDate, 6)
              return (
                p.payment_type === "SINGLE_COLLEGE_CLOSING_RANK" &&
                isBefore(currentDate, expiryDate) &&
                isCollegePurchased(college, p.closing_rank_details, coursesList)
              )
            })

            return matchingPurchase ? { ...college, purchased: true } : college
          })
        }
      }
    }
  }

  return {
    data: hiddenData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  }
}

function isCollegePurchased(college: any, userCollege: any, coursesList: any) {
  const { instituteName, instituteType, state, courseType, year } = userCollege

  if (courseType === "UG") {
    return (
      college.instituteName === instituteName &&
      college.course === coursesList &&
      college.instituteType === instituteType &&
      college.state === state &&
      college.year === year
    )
  } else {
    return (
      college.instituteName === instituteName &&
      college.instituteType === instituteType &&
      college.state === state &&
      college.year === year &&
      coursesList.includes(college.course)
    )
  }
}

