
import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient()
  const { searchParams } = new URL(request.url)

const stateCodeParam = searchParams.get('stateCode')||null;
const stateCode = stateCodeParam && stateCodeParam !== 'null' ? stateCodeParam : null;

const tableName = stateCode
  ? `college_table_${stateCode}`
  : 'college_table_all_india';


const { data, error } = await supabase
  .from(tableName)
 .select('quota, "subQuota", category, "subCategory", "courseType"')
// console.log("Table",tableName,data)

  if (error) {
    console.error("Supabase Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
