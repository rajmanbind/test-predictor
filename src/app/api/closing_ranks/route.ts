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
    !college?.state ||
    !college?.year
  ) {
    return NextResponse.json(
      {
        error:
          "All fields (instituteName, instituteType, courseType, state, year) are required",
      },
      { status: 400 },
    )
  }

  const supabaseUser = createUserSupabaseClient()

  if (college?.courseType === "UG") {
    // Get total count
    const { count, error: countError } = await supabaseUser
      .from("college_table")
      .select("*", { count: "exact", head: true })
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .eq("state", college.state)
      .eq("year", parseInt(college.year))

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error } = await supabaseUser
      .from("college_table")
      .select("*")
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .eq("state", college.state)
      .eq("year", parseInt(college.year))
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / pageSize)

    return NextResponse.json({
      data,
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    })
  } else {
    const supabase = createAdminSupabaseClient()

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("subType", college.course)

    const filterCourseList = courseData?.map((c: any) => c.text) ?? []

    // Get total count
    const { count, error: countError } = await supabaseUser
      .from("college_table")
      .select("*", { count: "exact", head: true })
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .in("course", filterCourseList)
      .eq("state", college.state)
      .eq("year", parseInt(college.year))

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error } = await supabaseUser
      .from("college_table")
      .select("*")
      .eq("instituteName", college.instituteName)
      .eq("instituteType", college.instituteType)
      .eq("courseType", college.courseType)
      .in("course", filterCourseList)
      .eq("state", college.state)
      .eq("year", parseInt(college.year))
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / pageSize)

    return NextResponse.json({
      data,
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    })
  }
}

