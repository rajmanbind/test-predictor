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
    if (stateCode === "all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}
// const getFilterValues = (params: URLSearchParams, key: string): string[] => {
//   const values = params.getAll(key)  // ✅ returns all array values
//   return values
//     .map(item => item.trim())
//     .filter(item => item && item !== 'null' && item !== 'undefined');
// };
const getFilterValues = (param: string[] | string | null): string[] => {
  if (!param) return [];

  // Case 1: Already an array from getAll()
  if (Array.isArray(param)) {
    return param
      .map(item => item.trim())
      .filter(item => item && item !== 'null' && item !== 'undefined');
  }

  // Case 2: Comma-separated string
  return param
    .split(',')
    .map(item => item.trim())
    .filter(item => item && item !== 'null' && item !== 'undefined');
};

// Usage with getAll for multi-select fields
// const category = getFilterValues(searchParams.getAll("category[]"));
// const instituteType = getFilterValues(searchParams.getAll("instituteType[]"));
// const quota = getFilterValues(searchParams.getAll("quota[]"));


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);



  // Pagination
  let page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "10");
  const paymentStatus = searchParams.get("paymentStatus") === "true";
  const stateCode = searchParams.get("stateCode");
  const course = searchParams.get("course");
  const tableName = getTableName(stateCode);
  
  if (!paymentStatus) page = 1;

  // Get filter values
  const rank = parseInt(searchParams.get("rank") || "0");
// Example usage:
const category = getFilterValues(searchParams.getAll("category[]"));
const instituteType = getFilterValues(searchParams.getAll("instituteType[]"));
const quota = getFilterValues(searchParams.getAll("quota[]"));

console.log("Quota,And Categoery: ",quota,category,instituteType)

  const feeFrom = parseInt(searchParams.get("feeFrom") || "0");
  const feeToRaw = searchParams.get("feeTo");
  const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw);
  const rankType = searchParams.get("rankType")?.toUpperCase();
  const courseType = searchParams.get("courseType")?.toUpperCase();

  // const isAllCourses = course.includes(`All ${courseType} Courses`);

  const supabase = createAdminSupabaseClient();

  // Get configured years
  const { data: selectedYear, error: yearsError } = await supabase
    .from("dropdown_options")
    .select("*")
    .eq("type", "CONFIG_YEAR")
    .single();

  if (yearsError) {
    return NextResponse.json(
      { msg: "Failed to get year config", error: yearsError },
      { status: 400 }
    );
  }
// console.log("Table Name: ",tableName)
  // Build query
  let query = supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters consistently
  query = query.eq("course", course?.trim());

  // if (isAllCourses && courseType) {
  //   query = query.eq("courseType", courseType);
  // }

if (instituteType.length > 0) {
  query = query.in("instituteType", instituteType);
}

if (quota.length > 0) {
  query = query.in("quota", quota);
}

if (category.length > 0) {
  query = query.in("category", category);
}

  if (feeFrom || feeTo !== Infinity) {
    query = query.gte("fees", feeFrom).lte("fees", feeTo);
  }

  console.log(query,searchParams)
  // Execute query
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }


  // // Merge and filter records based on rank and domicileState
  let mergedData: any[] = []
  const recordMap = new Map()


  data.forEach((item) => {
    let shouldIncludeByRank: any = false

    if (rankType === "RANK" || rankType === "Rank") {
      shouldIncludeByRank =
        Number(rank) > 0
          ? [
              item.lastStrayRound,
              item.strayRound,
              item.closingRankR3,
              item.closingRankR2,
              item.closingRankR1,
            ].some(
              (rankVal) =>
                cleanRanks(rankVal) && Number(rank) <= cleanRanks(rankVal),
            )
          : true
    } else {
      shouldIncludeByRank =
        Number(rank) > 0
          ? [item.lSRR, item.sRR, item.cRR3, item.cRR2, item.cRR1].some(
              (mark) => {
                const value = cleanMarks(mark)
                return Number(rank) >= value
              },
            )
          : true
    }

    // Apply domicileState filter with rank check
    // const shouldIncludeByState =
    //   states.length > 0
    //     ? states.includes(latest?.state) || states.includes(old?.state)
    //     : true

    if (shouldIncludeByRank) {
      const record: any = {
        id: item.id,
        created_at: item.created_at,
        instituteType: item.instituteType,
        instituteName: item.instituteName,
        quota: item.quota,
        category: item.category,
        course: item.course,
        courseType: item.courseType,
        fees: item.fees,
        subQuota: item.subQuota,
        subCategory: item.subCategory,

        // showClosingRankR1: item.closingRankR1
        //   ? `${item.closingRankR1}/${item.cRR1}`
        //   : null,
        // showClosingRankR2: item.closingRankR2
        //   ? `${item.closingRankR2}/${item.cRR2}`
        //   : null,
        // showClosingRankR3: item.closingRankR3
        //   ? `${item.closingRankR3}/${item.cRR3}`
        //   : null,
        // showStrayRound: item.strayRound
        //   ? `${item.strayRound}/${item.sRR}`
        //   : null,
        // showLastStrayRound: item.lastStrayRound
        //   ? `${item.lastStrayRound}/${item.slRR}`
        //   : null,

        // showPrevClosingRankR1: item.prevClosingRankR1
        //   ? `${item.prevClosingRankR1}/${item.prevCRR1}`
        //   : null,
        // showPrevClosingRankR2: item.prevClosingRankR2
        //   ? `${item.prevClosingRankR2}/${item.prevCRR2}`
        //   : null,
        // showPrevClosingRankR3: item.prevClosingRankR3
        //   ? `${item.prevClosingRankR3}/${item.prevCRR3}`
        //   : null,
        // showPrevStrayRound: item.strayRound
        //   ? `${item.strayRound}/${item.prevSRR}`
        //   : null,
        // showPrevLastStrayRound: item.lastStrayRound
        //   ? `${item.lastStrayRound}/${item.prevlSRR}`
        //   : null,

        sortKey: Math.min(
          cleanRanks(item?.closingRankR1) || Infinity,
          cleanRanks(item?.closingRankR2) || Infinity,
          cleanRanks(item?.closingRankR3) || Infinity,
          cleanRanks(item?.strayRound) || Infinity,
          // !latest ? cleanRanks(old?.closingRankR1) || Infinity : Infinity,
          // !latest ? cleanRanks(old?.closingRankR2) || Infinity : Infinity,
          // !latest ? cleanRanks(old?.closingRankR3) || Infinity : Infinity,
          // !latest ? cleanRanks(old?.strayRound) || Infinity : Infinity,
        ),
      }

      mergedData.push(record)
    }
  })

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

let cleanData:any = []
if(paymentStatus){
cleanData =
    data &&
    data.map((item) => ({
      id: item.id,
      created_at: item.created_at,
      instituteType: item.instituteType,
      instituteName: item.instituteName,
      quota: item.quota,
      category: item.category,
      course: item.course,
      courseType: item.courseType,
      fees: item.fees,
      subQuota: item.subQuota,
      subCategory: item.subCategory,

      showClosingRankR1: item.closingRankR1
        ? `${item.closingRankR1} / ${item.cRR1}`
        : null,


  
      showClosingRankR2: item.closingRankR2
        ? `${item.closingRankR2}/${item.cRR2}`
        : null,
      showClosingRankR3: item.closingRankR3
        ? `${item.closingRankR3}/${item.cRR3}`
        : null,
      showStrayRound: item.strayRound ? `${item.strayRound}/${item.sRR}` : null,
      showLastStrayRound: item.lastStrayRound
        ? `${item.lastStrayRound}/${item.slRR}`
        : null,

      showPrevClosingRankR1: item.prevClosingRankR1
        ? `${item.prevClosingRankR1} / ${item.prevCRR1}`
        : null,



      showPrevClosingRankR2: item.prevClosingRankR2
        ? `${item.prevClosingRankR2}/${item.prevCRR2}`
        : null,
      showPrevClosingRankR3: item.prevClosingRankR3
        ? `${item.prevClosingRankR3}/${item.prevCRR3}`
        : null,
      showPrevStrayRound: item.strayRound
        ? `${item.strayRound}/${item.prevSRR}`
        : null,
      showPrevLastStrayRound: item.lastStrayRound
        ? `${item.lastStrayRound}/${item.prevlSRR}`
        : null,
    }))

}
else{
cleanData=
    data &&
    data.map((item) => ({
      id: item.id,
      created_at: item.created_at,
      instituteType: item.instituteType,
      instituteName: item.instituteName,
      quota: item.quota,
      category: item.category,
      course: item.course,
      courseType: item.courseType,
      fees: item.fees,
      subQuota: item.subQuota,
      subCategory: item.subCategory,

      showClosingRankR1: item.closingRankR1
        ? `${item.closingRankR1} / ${item.cRR1}`
        : null,


      showClosingRankR2: null,
      showClosingRankR3:  null,
      showStrayRound:null,
      showLastStrayRound: null,
      // showClosingRankR2: item.closingRankR2
      //   ? `${item.closingRankR2}/${item.cRR2}`
      //   : null,
      // showClosingRankR3: item.closingRankR3
      //   ? `${item.closingRankR3}/${item.cRR3}`
      //   : null,
      // showStrayRound: item.strayRound ? `${item.strayRound}/${item.sRR}` : null,
      // showLastStrayRound: item.lastStrayRound
      //   ? `${item.lastStrayRound}/${item.slRR}`
      //   : null,

      showPrevClosingRankR1: item.prevClosingRankR1
        ? `${item.prevClosingRankR1} / ${item.prevCRR1}`
        : null,


      showPrevClosingRankR2: null,
      showPrevClosingRankR3:null,
      showPrevStrayRound:null,
      showPrevLastStrayRound:null,
      // showPrevClosingRankR1: item.prevClosingRankR2
      //   ? `${item.prevClosingRankR2}/${item.prevCRR2}`
      //   : null,
      // showPrevClosingRankR3: item.prevClosingRankR3
      //   ? `${item.prevClosingRankR3}/${item.prevCRR3}`
      //   : null,
      // showPrevStrayRound: item.strayRound
      //   ? `${item.strayRound}/${item.prevSRR}`
      //   : null,
      // showPrevLastStrayRound: item.lastStrayRound
      //   ? `${item.lastStrayRound}/${item.prevlSRR}`
      //   : null,
    }))

}
console.log("Payment Status: ",paymentStatus)

  if (!paymentStatus) {
    mergedData = mergedData.map((item) => ({
      ...item,
      // showClosingRankR1: "xxx",
      // showClosingRankR2: "xxx",
      // showClosingRankR3: "xxx",
      // showStrayRound: "xxx",
      // showLastStrayRound: "xxx",
      // strayRound_new: "xxx",
      // finalStrayRound_old: "xxx",
      // finalStrayRound_new: "xxx",
      // lastStrayRound_old: "xxx",
      // lastStrayRound_new: "xxx",


  
        showClosingRankR1: item.closingRankR1
          ? `${item.closingRankR1}/${item.cRR1}`
          : null,
        showClosingRankR2: null,
        showClosingRankR3:  null,
        showStrayRound: null,
        showLastStrayRound: null,

        showPrevClosingRankR1: item.prevClosingRankR1
          ? `${item.prevClosingRankR1}/${item.prevCRR1}`
          : null,

        showPrevClosingRankR2:  null,
        showPrevClosingRankR3: null,
        showPrevStrayRound: null,
        showPrevLastStrayRound: null,

    }))
  }

  // Pagination
  const totalItems = cleanData && cleanData.length
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

