import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { paymentType } from "@/utils/static"
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
  const supabaseUser = createUserSupabaseClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

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
        (item: any) => item.state?.toLowerCase() === state.toLowerCase(),
      )
    : data

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
          const purchaseDate = parseISO(purchase.created_at)
          const expiryDate = addMonths(purchaseDate, 6)
          return (
            purchase.payment_type === "STATE_CLOSING_RANK" &&
            purchase.state === state &&
            isBefore(currentDate, expiryDate)
          )
        })

        if (hasValidStatePurchase) {
          hiddenData = paginated
        } else {
          // Single College Plan Check of UG and PG particularly state
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
      }
    }
  }

  return NextResponse.json({
    data: hiddenData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}

function isCollegePurchased(college: any, userCollege: any) {
  const { instituteName, instituteType, state, courseType, year } = userCollege

  return (
    college.instituteName === instituteName &&
    college.instituteType === instituteType &&
    college.state === state &&
    college.courseType === courseType &&
    college.year === year
  )
}
