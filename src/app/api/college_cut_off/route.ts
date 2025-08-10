import { createAdminSupabaseClient,createUserSupabaseClient} from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
function getTableName(stateCode?: string | null): string {
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    if(stateCode==="all")
     return `college_table_all_india`
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const instituteName = searchParams.get("instituteName")?.trim()
  const courseType = searchParams.get("courseType")?.trim()
  const dataCheckMode = searchParams.get("dataCheckMode")
  const stateCode = searchParams.get("stateCode")
  const state = searchParams.get("state")

  const supabase = createAdminSupabaseClient()
const tableName = getTableName(stateCode)

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
        data: selectedYear,
      },
      { status: 400 },
    )
  }

  const latestYears = selectedYear.text
    ?.split("-")
    .map((item: string) => item.trim())
// console.log("tablename and instituteName",tableName,instituteName)
  const {data:resData,error:err} = await supabase
    .from(tableName)
    .select("*")
    .ilike("instituteName", `%${instituteName}%`)
    // .eq("courseType", courseType)

  // const { data, error } = await query.order("created_at", { ascending: false })

  if (err) {
    return new Response(JSON.stringify({ err }), { status: 400 })
  }

  if (dataCheckMode) {
    const hasData = resData?.length > 0
    return NextResponse.json({ hasData })
  }

   const cleanData = resData &&resData.map(item=>
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
console.log("Sending Data: ",cleanData)
  //   mergedData.push({
  //     prev_id: old?.id,
  //     new_id: latest?.id,
  //     created_at: latest?.created_at ?? old?.created_at,
  //     instituteName: latest?.instituteName ?? old?.instituteName,
  //     instituteType: latest?.instituteType ?? old?.instituteType,
  //     state: latest?.state ?? old?.state,
  //     course: latest?.course ?? old?.course,
  //     quota: latest?.quota ?? old?.quota,
  //     category: latest?.category ?? old?.category,
  //     fees: latest?.fees ?? old?.fees,
  //     closingRankR1_old:
  //       old?.closingRankR1 + (old?.cRR1 ? `/ ${old?.cRR1}` : ""),
  //     closingRankR2_old:
  //       old?.closingRankR2 + (old?.cRR2 ? `/ ${old?.cRR2}` : ""),
  //     closingRankR3_old:
  //       old?.closingRankR3 + (old?.cRR3 ? `/ ${old?.cRR3}` : ""),
  //     strayRound_old: old?.strayRound + (old?.sRR ? `/ ${old?.sRR}` : ""),
  //     lastStrayRound_old:
  //       old?.lastStrayRound + (old?.lSRR ? `/ ${old?.lSRR}` : ""),
  //     closingRankR1_new:
  //       latest?.closingRankR1 + (latest?.cRR1 ? `/ ${latest?.cRR1}` : ""),
  //     closingRankR2_new:
  //       latest?.closingRankR2 + (latest?.cRR2 ? `/ ${latest?.cRR2}` : ""),
  //     closingRankR3_new:
  //       latest?.closingRankR3 + (latest?.cRR3 ? `/ ${latest?.cRR3}` : ""),
  //     strayRound_new:
  //       latest?.strayRound + (latest?.sRR ? `/ ${latest?.sRR}` : ""),
  //     lastStrayRound_new:
  //       latest?.lastStrayRound + (latest?.lSRR ? `/ ${latest?.lSRR}` : ""),
  //     year:
  //       old?.year && latest?.year
  //         ? `${old.year} - ${latest.year}`
  //         : (old?.year ?? latest?.year),
  //   })
  // })

  // Return all merged data
  return NextResponse.json({
    data: cleanData,
  })
}

