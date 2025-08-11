import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextRequest, NextResponse } from "next/server"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}

export async function POST(request: NextRequest) {
  try {
    const { id,stateCode } = await request.json()
const tableName = getTableName(stateCode)
    const supabase = createAdminSupabaseClient()

    const { error, data } = await supabase
      .from(tableName)
      .delete()
      .in("id", id)
      .select()

    if (error || isEmpty(data)) {
      return NextResponse.json(
        { msg: "Failed to delete record", error, data },
        { status: 400 },
      )
    }

    return NextResponse.json({ msg: "Record deleted successfully." })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      { status: 400 },
    )
  }
}
