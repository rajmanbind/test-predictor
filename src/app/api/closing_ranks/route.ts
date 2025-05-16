import {
  createAdminSupabaseClient,
  createUserSupabaseClient,
} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Parse and validate query parameters
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("size") || "10")
  const state = searchParams.get("state")?.trim()
  const year = searchParams.get("year")?.trim()

  // Input validation
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

  // Calculate range for pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Build the query
  let query = supabase
    .from("college_table")
    .select("*", { count: "exact" }) // Include count for total items
    .in("year", [year])
    .order("created_at", { ascending: false })
    .range(from, to) // Database-level pagination

  if (state) {
    query = query.ilike("state", state)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Supabase error:", error.message)
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 },
    )
  }

  let hiddenData = data?.map((item) => {
    return {
      ...item,
      closingRankR2: "xxx",
      closingRankR3: "xxx",
      strayRound: "xxx",
      lastStrayRound: "xxx",
      fees: "xxx",
    }
  })

  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  if (user) {
    const { data: userPurchases, error: purchasesError } = await supabaseUser
      .from("purchase")
      .select(
        `
      *,
      college_table:rowId (*)
    `,
      )
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

    if (userPurchases && userPurchases?.length > 0 && hiddenData?.length > 0) {
      hiddenData = hiddenData?.map((college) => {
        const matchingPurchase = userPurchases.find(
          (p) => p.rowId === college.id,
        )
        return matchingPurchase
          ? { ...matchingPurchase.college_table, purchased: true }
          : college
      })
    }
  }

  // Calculate pagination metadata
  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / pageSize)

  return NextResponse.json({
    data: hiddenData ?? [],
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}

