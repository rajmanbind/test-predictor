// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// export const dynamic = "force-dynamic"
// function getTableName(stateCode?: string | null): string {
//   if (
//     stateCode &&
//     stateCode !== "null" &&
//     stateCode !== "undefined" &&
//     stateCode !== ""
//   ) {
//     if (stateCode === "all") return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   }
//   return "college_table_all_india"
// }
// const getFilterValues = (param: string[] | string | null): string[] => {
//   if (!param) return [];

//   // Case 1: Already an array from getAll()
//   if (Array.isArray(param)) {
//     return param
//       .map(item => item.trim())
//       .filter(item => item && item !== 'null' && item !== 'undefined');
//   }

//   // Case 2: Comma-separated string
//   return param
//     .split(',')
//     .map(item => item.trim())
//     .filter(item => item && item !== 'null' && item !== 'undefined');
// };


// // export async function GET(request: NextRequest) {
// //   const { searchParams } = new URL(request.url);



// //   // Pagination
// //   let page = parseInt(searchParams.get("page") || "1");
// //   const pageSize = parseInt(searchParams.get("size") || "10");
// //   const paymentStatus = searchParams.get("paymentStatus") === "true";
// //   const stateCode = searchParams.get("stateCode");
// //   const course = searchParams.get("course");
// //   const quotas = searchParams.get("quota");
// //   const subQuota = searchParams.get("subQuota");
// //   const categoryy = searchParams.get("category");
// //   const subCategory = searchParams.get("subCategory");

// //   const tableName = getTableName(stateCode);
  
// //   if (!paymentStatus) page = 1;

// //   // Get filter values
// //   const rank = parseInt(searchParams.get("rank") || "0");
// // // Example usage:
// // const category = getFilterValues(searchParams.getAll("category[]"));
// // const instituteType = getFilterValues(searchParams.getAll("instituteType[]"));
// // const quota = getFilterValues(searchParams.getAll("quota[]"));

// // // console.log("Quota,And Categoery: ",quota,category,instituteType)

// //   const feeFrom = parseInt(searchParams.get("feeFrom") || "0");
// //   const feeToRaw = searchParams.get("feeTo");
// //   const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw);
// //   const rankType = searchParams.get("rankType")?.toUpperCase();
// //   const courseType = searchParams.get("courseType")?.toUpperCase();

// //   // const isAllCourses = course.includes(`All ${courseType} Courses`);

// //   const supabase = createAdminSupabaseClient();

// //   // Get configured years
// //   const { data: selectedYear, error: yearsError } = await supabase
// //     .from("dropdown_options")
// //     .select("*")
// //     .eq("type", "CONFIG_YEAR")
// //     .single();

// //   if (yearsError) {
// //     return NextResponse.json(
// //       { msg: "Failed to get year config", error: yearsError },
// //       { status: 400 }
// //     );
// //   }
// // // console.log("Table Name: ",tableName)
// //   // Build query
// //   // let query = supabase
// //   //   .from(tableName)
// //   //   .select("*")
// //   //   .order("created_at", { ascending: false });

// //   // // Apply filters consistently
// //   // query = query.eq("course", course?.trim());

// //   // if (courseType) {
// //   //   query = query.eq("courseType", courseType);
// //   // }
// // // Get filter values - use consistent naming
// // const quotaFilter = getFilterValues(searchParams.getAll("quota[]"));
// // const categoryFilter = getFilterValues(searchParams.getAll("category[]"));
// // const instituteTypeFilter = getFilterValues(searchParams.getAll("instituteType[]"));

// // // Build query
// // let query = supabase
// //   .from(tableName)
// //   .select("*")
// //   .order("created_at", { ascending: false });

// // // Apply basic filters
// // if (course) {
// //   query = query.eq("course", course.trim());
// // }

// // if (courseType) {
// //   query = query.eq("courseType", courseType);
// // }

// // // Apply quota filters
// // if (quotaFilter.length > 0) {
// //   query = query.in("quota", quotaFilter);
// // } else if (quotas) { // Fallback to single quota if array not provided
// //   query = query.eq("quota", quotas);
// // }

// // if (subQuota) {
// //   query = query.eq("subQuota", subQuota);
// // }

// // // Apply category filters
// // if (categoryFilter.length > 0) {
// //   query = query.in("category", categoryFilter);
// // } else if (categoryy) { // Fallback to single category if array not provided
// //   query = query.eq("category", categoryy);
// // }

// // if (subCategory) {
// //   query = query.eq("subCategory", subCategory);
// // }

// // // Apply institute type filters
// // if (instituteTypeFilter.length > 0) {
// //   query = query.in("instituteType", instituteTypeFilter);
// // }

// // // Fee range filter
// // if (feeFrom || feeTo !== Infinity) {
// //   query = query.gte("fees", feeFrom).lte("fees", feeTo);
// // }



// //   console.log("Predict College:  for the first time api call: ",query,searchParams)
// //   // Execute query
// //   const { data, error } = await query;

// //   if (error) {
// //     return NextResponse.json({ error }, { status: 400 });
// //   }


// //   // // Merge and filter records based on rank and domicileState
// //   let mergedData: any[] = []
// //   const recordMap = new Map()


// //   data.forEach((item) => {
// //     let shouldIncludeByRank: any = false

// //     if (rankType === "RANK" || rankType === "Rank") {
// //       shouldIncludeByRank =
// //         Number(rank) > 0
// //           ? [
// //               item.lastStrayRound,
// //               item.strayRound,
// //               item.closingRankR3,
// //               item.closingRankR2,
// //               item.closingRankR1,
// //             ].some(
// //               (rankVal) =>
// //                 cleanRanks(rankVal) && Number(rank) <= cleanRanks(rankVal),
// //             )
// //           : true
// //     } else {
// //       shouldIncludeByRank =
// //         Number(rank) > 0
// //           ? [item.lSRR, item.sRR, item.cRR3, item.cRR2, item.cRR1].some(
// //               (mark) => {
// //                 const value = cleanMarks(mark)
// //                 return Number(rank) >= value
// //               },
// //             )
// //           : true
// //     }


// //     if (shouldIncludeByRank) {
// //       const record: any = {
// //         id: item.id,
// //         created_at: item.created_at,
// //         instituteType: item.instituteType,
// //         instituteName: item.instituteName,
// //         quota: item.quota,
// //         category: item.category,
// //         course: item.course,
// //         courseType: item.courseType,
// //         fees: item.fees,
// //         subQuota: item.subQuota,
// //         subCategory: item.subCategory,

// //         // showClosingRankR1: item.closingRankR1
// //         //   ? `${item.closingRankR1}/${item.cRR1}`
// //         //   : null,
// //         // showClosingRankR2: item.closingRankR2
// //         //   ? `${item.closingRankR2}/${item.cRR2}`
// //         //   : null,
// //         // showClosingRankR3: item.closingRankR3
// //         //   ? `${item.closingRankR3}/${item.cRR3}`
// //         //   : null,
// //         // showStrayRound: item.strayRound
// //         //   ? `${item.strayRound}/${item.sRR}`
// //         //   : null,
// //         // showLastStrayRound: item.lastStrayRound
// //         //   ? `${item.lastStrayRound}/${item.slRR}`
// //         //   : null,

// //         // showPrevClosingRankR1: item.prevClosingRankR1
// //         //   ? `${item.prevClosingRankR1}/${item.prevCRR1}`
// //         //   : null,
// //         // showPrevClosingRankR2: item.prevClosingRankR2
// //         //   ? `${item.prevClosingRankR2}/${item.prevCRR2}`
// //         //   : null,
// //         // showPrevClosingRankR3: item.prevClosingRankR3
// //         //   ? `${item.prevClosingRankR3}/${item.prevCRR3}`
// //         //   : null,
// //         // showPrevStrayRound: item.strayRound
// //         //   ? `${item.strayRound}/${item.prevSRR}`
// //         //   : null,
// //         // showPrevLastStrayRound: item.lastStrayRound
// //         //   ? `${item.lastStrayRound}/${item.prevlSRR}`
// //         //   : null,

// //         sortKey: Math.min(
// //           cleanRanks(item?.closingRankR1) || Infinity,
// //           cleanRanks(item?.closingRankR2) || Infinity,
// //           cleanRanks(item?.closingRankR3) || Infinity,
// //           cleanRanks(item?.strayRound) || Infinity,
// //         ),
// //       }

// //       mergedData.push(record)
// //     }
// //   })

// //   // Sort records: prioritize domicileState matches first, then others, both sorted by rank
// //   // mergedData.sort((a, b) => {
// //   //   const aIsDomicileMatch = domicileState && a.state === domicileState
// //   //   const bIsDomicileMatch = domicileState && b.state === domicileState

// //   //   // Prioritize domicile matches
// //   //   if (aIsDomicileMatch && !bIsDomicileMatch) return -1
// //   //   if (!aIsDomicileMatch && bIsDomicileMatch) return 1

// //   //   // Within same domicile status, sort by sortKey (lowest rank first)
// //   //   return a.sortKey - b.sortKey
// //   // })

// // let cleanData:any = []
// // if(paymentStatus){
// // cleanData =
// //     data &&
// //     data.map((item) => ({
// //       id: item.id,
// //       created_at: item.created_at,
// //       instituteType: item.instituteType,
// //       instituteName: item.instituteName,
// //       quota: item.quota,
// //       category: item.category,
// //       course: item.course,
// //       courseType: item.courseType,
// //       fees: item.fees,
// //       subQuota: item.subQuota,
// //       subCategory: item.subCategory,

// //       showClosingRankR1: item.closingRankR1
// //         ? `${item.closingRankR1} / ${item.cRR1}`
// //         : null,


  
// //       showClosingRankR2: item.closingRankR2
// //         ? `${item.closingRankR2}/${item.cRR2}`
// //         : null,
// //       showClosingRankR3: item.closingRankR3
// //         ? `${item.closingRankR3}/${item.cRR3}`
// //         : null,
// //       showStrayRound: item.strayRound ? `${item.strayRound}/${item.sRR}` : null,
// //       showLastStrayRound: item.lastStrayRound
// //         ? `${item.lastStrayRound}/${item.slRR}`
// //         : null,

// //       showPrevClosingRankR1: item.prevClosingRankR1
// //         ? `${item.prevClosingRankR1} / ${item.prevCRR1}`
// //         : null,



// //       showPrevClosingRankR2: item.prevClosingRankR2
// //         ? `${item.prevClosingRankR2}/${item.prevCRR2}`
// //         : null,
// //       showPrevClosingRankR3: item.prevClosingRankR3
// //         ? `${item.prevClosingRankR3}/${item.prevCRR3}`
// //         : null,
// //       showPrevStrayRound: item.strayRound
// //         ? `${item.strayRound}/${item.prevSRR}`
// //         : null,
// //       showPrevLastStrayRound: item.lastStrayRound
// //         ? `${item.lastStrayRound}/${item.prevlSRR}`
// //         : null,
// //                 ...((stateCode === "all"||stateCode === "All") && { state: item.state }) 
// //     }))

// // }
// // else{
// // cleanData=
// //     data &&
// //     data.map((item) => ({
// //       id: item.id,
// //       created_at: item.created_at,
// //       instituteType: item.instituteType,
// //       instituteName: item.instituteName,
// //       quota: item.quota,
// //       category: item.category,
// //       course: item.course,
// //       courseType: item.courseType,
// //       fees: item.fees,
// //       subQuota: item.subQuota,
// //       subCategory: item.subCategory,

// //       showClosingRankR1: item.closingRankR1
// //         ? `${item.closingRankR1} / ${item.cRR1}`
// //         : null,


// //       showClosingRankR2: null,
// //       showClosingRankR3:  null,
// //       showStrayRound:null,
// //       showLastStrayRound: null,
// //       // showClosingRankR2: item.closingRankR2
// //       //   ? `${item.closingRankR2}/${item.cRR2}`
// //       //   : null,
// //       // showClosingRankR3: item.closingRankR3
// //       //   ? `${item.closingRankR3}/${item.cRR3}`
// //       //   : null,
// //       // showStrayRound: item.strayRound ? `${item.strayRound}/${item.sRR}` : null,
// //       // showLastStrayRound: item.lastStrayRound
// //       //   ? `${item.lastStrayRound}/${item.slRR}`
// //       //   : null,

// //       showPrevClosingRankR1: item.prevClosingRankR1
// //         ? `${item.prevClosingRankR1} / ${item.prevCRR1}`
// //         : null,


// //       showPrevClosingRankR2: null,
// //       showPrevClosingRankR3:null,
// //       showPrevStrayRound:null,
// //       showPrevLastStrayRound:null,
// //       // showPrevClosingRankR1: item.prevClosingRankR2
// //       //   ? `${item.prevClosingRankR2}/${item.prevCRR2}`
// //       //   : null,
// //       // showPrevClosingRankR3: item.prevClosingRankR3
// //       //   ? `${item.prevClosingRankR3}/${item.prevCRR3}`
// //       //   : null,
// //       // showPrevStrayRound: item.strayRound
// //       //   ? `${item.strayRound}/${item.prevSRR}`
// //       //   : null,
// //       // showPrevLastStrayRound: item.lastStrayRound
// //       //   ? `${item.lastStrayRound}/${item.prevlSRR}`
// //       //   : null,
// //          ...((stateCode === "all"||stateCode === "All") && { state: item.state }) 
// //     }))

// // }
// // // console.log("Payment Status: ",paymentStatus)

// //   if (!paymentStatus) {
// //     mergedData = mergedData.map((item) => ({
// //       ...item,
// //       // showClosingRankR1: "xxx",
// //       // showClosingRankR2: "xxx",
// //       // showClosingRankR3: "xxx",
// //       // showStrayRound: "xxx",
// //       // showLastStrayRound: "xxx",
// //       // strayRound_new: "xxx",
// //       // finalStrayRound_old: "xxx",
// //       // finalStrayRound_new: "xxx",
// //       // lastStrayRound_old: "xxx",
// //       // lastStrayRound_new: "xxx",


  
// //         showClosingRankR1: item.closingRankR1
// //           ? `${item.closingRankR1}/${item.cRR1}`
// //           : null,
// //         showClosingRankR2: null,
// //         showClosingRankR3:  null,
// //         showStrayRound: null,
// //         showLastStrayRound: null,

// //         showPrevClosingRankR1: item.prevClosingRankR1
// //           ? `${item.prevClosingRankR1}/${item.prevCRR1}`
// //           : null,

// //         showPrevClosingRankR2:  null,
// //         showPrevClosingRankR3: null,
// //         showPrevStrayRound: null,
// //         showPrevLastStrayRound: null,

// //     }))
// //   }
// //   let totalItems;
// //   let totalPages;
// //   let paginatedData ;
// //   if(paymentStatus){
// //   // Pagination
// //    totalItems = cleanData && cleanData.length
// //    totalPages = Math.ceil(totalItems / pageSize)
// //    paginatedData = cleanData.slice((page - 1) * pageSize, page * pageSize)

// //   }
// //   else{
// //       // Pagination
// //    totalItems = 10
// //    totalPages = 1
// //    paginatedData = cleanData.slice((page - 1) * pageSize, page * pageSize)
// //   }

// //   return NextResponse.json({
// //     data: paginatedData,
// //     currentPage: page,
// //     pageSize,
// //     totalItems,
// //     totalPages,
// //   })
// // }


// // ... (previous imports and constants remain the same)

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   // Pagination
//   let page = parseInt(searchParams.get("page") || "1");
//   const pageSize = parseInt(searchParams.get("size") || "10");
//   const paymentStatus = searchParams.get("paymentStatus") === "true";
//   const stateCode = searchParams.get("stateCode");
//   const course =  searchParams.get("course");
//   const quota =  searchParams.get("quota");
//   const subQuota =  searchParams.get("subQuota");
//   const category =  searchParams.get("category");
//   const subCategory =  searchParams.get("subCategory");

//   const tableName = getTableName(stateCode);
  
//   if (!paymentStatus) page = 1;

//   // Get filter values
//   const rank = parseInt(searchParams.get("rank") || "0");
//   const rankType = searchParams.get("rankType")?.toUpperCase();
//   const courseType =  searchParams.get("courseType")?.toUpperCase();
  
//   // Get other filter values
//   const categoryFilter = getFilterValues(searchParams.getAll("category[]"));
//   const instituteTypeFilter = getFilterValues(searchParams.getAll("instituteType[]"));
//   const quotaFilter = getFilterValues(searchParams.getAll("quota[]"));

//   const feeFrom = parseInt(searchParams.get("feeFrom") || "0");
//   const feeToRaw = searchParams.get("feeTo");
//   const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw);

//   const supabase = createAdminSupabaseClient();

//   // Get configured years
//   const { data: selectedYear, error: yearsError } = await supabase
//     .from("dropdown_options")
//     .select("*")
//     .eq("type", "CONFIG_YEAR")
//     .single();

//   if (yearsError) {
//     return NextResponse.json(
//       { msg: "Failed to get year config", error: yearsError },
//       { status: 400 }
//     );
//   }

//   // Build query
//   let query = supabase
//     .from(tableName)
//     .select("*")
//     .order("created_at", { ascending: false });

//   // Apply basic filters
//   if (course) {
//     query = query.eq("course", course.trim());
//   }

//   if (courseType) {
//     query = query.eq("courseType", courseType);
//   }

//   // Apply quota filters
//   if (quotaFilter.length > 0) {
//     query = query.in("quota", quotaFilter);
//   } else if (quota) {
//     query = query.eq("quota", quota);
//   }

//   if (subQuota) {
//     query = query.eq("subQuota", subQuota);
//   }

//   // Apply category filters
//   if (categoryFilter.length > 0) {
//     query = query.in("category", categoryFilter);
//   } else if (category) {
//     query = query.eq("category", category);
//   }

//   if (subCategory) {
//     query = query.eq("subCategory", subCategory);
//   }

//   // Apply institute type filters
//   if (instituteTypeFilter.length > 0) {
//     query = query.in("instituteType", instituteTypeFilter);
//   }

//   // Fee range filter
//   if (feeFrom || feeTo !== Infinity) {
//     query = query.gte("fees", feeFrom).lte("fees", feeTo);
//   }

//   // Execute query
//   const { data, error } = await query;

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   // Filter data based on rank
//   // const filteredData = data.filter((item) => {
//   //   if (rank <= 0) return true; // No rank filter applied
    
//   //   if (rankType === "RANK" || rankType === "Rank") {
//   //     // Check if any of the rank values match the filter
//   //     return [
//   //       item.prevLastStrayRound,
//   //       item.prevStrayRound,
//   //       item.prevSlosingRankR3,
//   //       item.prevClosingRankR2,
//   //       item.prevClosingRankR1,
//   //     ].some((rankVal) => {
//   //       const cleanRank = cleanRanks(rankVal);
//   //       return cleanRank > 0 && rank <= cleanRank;
//   //     });
//   //   } else {
//   //     // For marks/percentile (higher is better)
//   //     return [
//   //       item.prevlSRR,
//   //       item.prevSRR,
//   //       item.prevCRR3,
//   //       item.prevCRR2,
//   //       item.prevCRR1,
//   //     ].some((mark) => {
//   //       const cleanMark = cleanMarks(mark);
//   //       return cleanMark > 0 && rank >= cleanMark;
//   //     });
//   //   }
//   // });

//   // --- inside GET() after fetching data ---

// const filteredData = data.filter((item) => {
//   if (rank <= 0) return true; // No rank filter applied

//   if (rankType === "RANK") {
//     // Candidate has rank → smaller is better

//     // const currentMatches = [
//     //   item.lastStrayRound,
//     //   item.strayRound,
//     //   item.closingRankR3,
//     //   item.closingRankR2,
//     //   item.closingRankR1,
//     // ].filter((rankVal) => {
//     //     if (rankVal == null || rankVal === "") return false;

//     //   const cleanRank = cleanRanks(rankVal);
//     //   return cleanRank > 0 && rank <= cleanRank;
//     // });

//     const prevMatches = [
//       item.prevLastStrayRound,
//       item.prevStrayRound,
//       item.prevClosingRankR3,
//       item.prevClosingRankR2,
//       item.prevClosingRankR1,
//     ].filter((rankVal) => {
//        if (rankVal == null || rankVal === "") return false;

//       const cleanRank = cleanRanks(rankVal);
//       return cleanRank > 0 && rank <= cleanRank;
//     });

//     // return currentMatches.length > 0 || prevMatches.length > 0;
//     return prevMatches.length > 0;

//   } else {
//     // Candidate has percentile/marks → higher is better

//   //   const currentMatches = [
//   //     item.lSRR,
//   //     item.sRR,
//   //     item.cRR3,
//   //     item.cRR2,
//   //     item.cRR1,
//   //   ].filter((mark) => {
//   //       // ignore null, undefined, empty string
//   // if (mark == null || mark === "") return false;

//   // const cleanRank = cleanRanks(mark);
//   // return cleanRank > 0 && rank <= cleanRank;
//   //     // const cleanMark = cleanMarks(mark);
//   //     // return rank >= cleanMark;
//   //   });

//     const prevMatches = [
//       item.prevlSRR,
//       item.prevSRR,
//       item.prevCRR3,
//       item.prevCRR2,
//       item.prevCRR1,
//     ].filter((mark) => {
//         if (mark == null || mark === "") return false;

//       const cleanMark = cleanMarks(mark);
//       return rank >= cleanMark;
//     });

//     // return currentMatches.length > 0 || prevMatches.length > 0;
//     return prevMatches.length > 0;
//   }
// });

//   // Prepare data for response based on payment status
//   const responseData = filteredData.map((item) => {
//     const baseData = {
//       id: item.id,
//       created_at: item.created_at,
//       instituteType: item.instituteType,
//       instituteName: item.instituteName,
//       quota: item.quota,
//       category: item.category,
//       course: item.course,
//       courseType: item.courseType,
//       fees: item.fees,
//       subQuota: item.subQuota,
//       subCategory: item.subCategory,
//       ...((stateCode === "all" || stateCode === "All") && { state: item.state }),
//     };

//     if (paymentStatus) {
//       return {
//         ...baseData,
        
//       showClosingRankR1: item.closingRankR1
//         ? `${item.closingRankR1}/${item.cRR1}`
//         : null,
//       showClosingRankR2: item.closingRankR2
//         ? `${item.closingRankR2}/${item.cRR2}`
//         : null,
//       showClosingRankR3: item.closingRankR3
//         ? `${item.closingRankR3}/${item.cRR3}`
//         : null,
//       showStrayRound: item.strayRound
//         ? `${item.strayRound}/${item.sRR}`
//         : null,
//       showLastStrayRound: item.lastStrayRound
//         ? `${item.lastStrayRound}/${item.lSRR}`
//         : null,

//       showPrevClosingRankR1: item.prevClosingRankR1
//         ? `${item.prevClosingRankR1}/${item.prevCRR1}`
//         : null,
//       showPrevClosingRankR2: item.prevClosingRankR2
//         ? `${item.prevClosingRankR2}/${item.prevCRR2}`
//         : null,
//       showPrevClosingRankR3: item.prevClosingRankR3
//         ? `${item.prevClosingRankR3}/${item.prevCRR3}`
//         : null,
//       showPrevStrayRound: item.prevStrayRound
//         ? `${item.prevStrayRound}/${item.prevSRR}`
//         : null,
//       showPrevLastStrayRound: item.prevLastStrayRound
//         ? `${item.prevLastStrayRound}/${item.prevlSRR}`
//         : null,
//       };
//     } else {
//       return {
//         ...baseData,
            
//       showClosingRankR1: item.closingRankR1
//         ? `${item.closingRankR1}/${item.cRR1}`
//         : null,
//         showClosingRankR2: null,
//         showClosingRankR3: null,
//         showStrayRound: null,
//         showLastStrayRound: null,
//    showPrevClosingRankR1: item.prevClosingRankR1
//         ? `${item.prevClosingRankR1}/${item.prevCRR1}`
//         : null,
//         showPrevClosingRankR2: null,
//         showPrevClosingRankR3: null,
//         showPrevStrayRound: null,
//         showPrevLastStrayRound: null,
//       };
//     }
//   });

//   // Pagination
//   const totalItems = responseData.length;
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const paginatedData = responseData.slice((page - 1) * pageSize, page * pageSize);

//   return NextResponse.json({
//     data: paginatedData,
//     currentPage: page,
//     pageSize,
//     totalItems,
//     totalPages,
//   });
// }

// // ... (cleanRanks and cleanMarks functions remain the same)
// function cleanRanks(ranks: string): number {
//   return Number(ranks) || 0
// }

// function cleanMarks(marks: any): number {
//   const value = Number(marks)
//   return isNaN(value) || value <= 0 ? Infinity : value
// }




// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// export const dynamic = "force-dynamic"


// function getTableName(stateCode?: string | null): string {
//   if (
//     stateCode &&
//     stateCode !== "null" &&
//     stateCode !== "undefined" &&
//     stateCode !== ""
//   ) {
//     if (stateCode === "all") return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   }
//   return "college_table_all_india"
// }

// const getFilterValues = (param: string[] | string | null): string[] => {
//   if (!param) return [];

//   if (Array.isArray(param)) {
//     return param
//       .map(item => item.trim())
//       .filter(item => item && item !== 'null' && item !== 'undefined');
//   }

//   return param
//     .split(',')
//     .map(item => item.trim())
//     .filter(item => item && item !== 'null' && item !== 'undefined');
// };

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);

//   // Pagination parameters
//   let page = parseInt(searchParams.get("page") || "1");
//   const pageSize = parseInt(searchParams.get("pageSize") || "10");
//   const paymentStatus = searchParams.get("paymentStatus") === "true";

//   if (!paymentStatus) {
//     page = 1;
//   }

//   // Search and filter parameters
//   const rank = parseInt(searchParams.get("rank") || "0");
//   const stateCode = searchParams.get("stateCode");
//   const rankType = searchParams.get("rankType")?.toString()?.toUpperCase();
//   const courseType = searchParams.get("courseType")?.toString()?.toUpperCase();
//     const course =  searchParams.get("course");
//   const quota =  searchParams.get("quota");
//   const subQuota =  searchParams.get("subQuota");
//   const category =  searchParams.get("category");
//   const subCategory =  searchParams.get("subCategory");
//   // Get filter values
//   const categoryFilter = getFilterValues(searchParams.getAll("category[]"));
//   const instituteTypeFilter = getFilterValues(searchParams.getAll("instituteType[]"));
//   const quotaFilter = getFilterValues(searchParams.getAll("quota[]"));
//   const courseFilter = getFilterValues(searchParams.getAll("course[]"));

//   const feeFrom = parseInt(searchParams.get("feeFrom") || "0");
//   const feeToRaw = searchParams.get("feeTo");
//   const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw);

//   const tableName = getTableName(stateCode);
//   const supabase = createAdminSupabaseClient();
//   // Build query
//   let query = supabase
//     .from(tableName)
//     .select("*")
//     .order("created_at", { ascending: false });
//   // Apply basic filters

//   // Apply filters
//   if (courseFilter.length > 0) {
//     query = query.in("course", courseFilter);
//   }
//   else if(course){
//     query = query.eq("course", course.trim());
    
//   }

//   if (courseType) {
//     query = query.eq("courseType", courseType);
//   }


//   // Apply quota filters
//   if (quotaFilter.length > 0) {
//     query = query.in("quota", quotaFilter);
//   } else if (quota) {
//     query = query.eq("quota", quota);
//   }

//   // if (subQuota) {
//   //   query = query.eq("subQuota", subQuota);
//   // }

//   // Apply category filters
//   if (categoryFilter.length > 0) {
//     query = query.in("category", categoryFilter);
//   } else if (category) {
//     query = query.eq("category", category);
//   }

//   if (instituteTypeFilter.length > 0) {
//     query = query.in("instituteType", instituteTypeFilter);
//   }

//   if (feeFrom || feeTo !== Infinity) {
//     query = query.gte("fees", feeFrom).lte("fees", feeTo);
//   }

//   // Add this to your query building section
// // if (rank > 0 && paymentStatus) {
// //   if (rankType?.toUpperCase() === "RANK") {
// //     query = query.or(
// //       `prevClosingRankR1.gte.${rank},prevClosingRankR2.gte.${rank},prevClosingRankR3.gte.${rank},prevStrayRound.gte.${rank},prevLastStrayRound.gte.${rank}`
// //     );
// //   } else {
// //     query = query.or(
// //       `prevCRR1.lte.${rank},prevCRR2.lte.${rank},prevCRR3.lte.${rank},prevSRR.lte.${rank},prevlSRR.lte.${rank}`
// //     );
// //   }
// // }
//   // Execute query
//   const { data, error } = await query;

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

// console.log("Initial data length:", data.length);
// console.log("Filter parameters:", { rank, rankType });



// //   const filteredData = data.filter((item,index) => {
// //       // console.log(`\nProcessing item ${index}:`, item);
// //  if (rank <= 0) {
// //     console.log("Including item - no rank filter");
// //     return true;
// //   }
// //   if (rankType === "RANK") {
// //     //  console.log("Checking rank fields...");
// //     const rankFields = [
// //       item.prevLastStrayRound,
// //       item.prevStrayRound,
// //       item.prevClosingRankR3,
// //       item.prevClosingRankR2,
// //       item.prevClosingRankR1,
// //     ].filter(mark => mark != null && mark !== "");

// //  // If no valid marks at all, exclude
// //     if (rankFields.length === 0) return false;
// //   // Check against only valid marks
// //     return rankFields.some(mark => {
// //       const cleanMark = cleanMarks(mark);
// //       return cleanMark > 0 && rank <= cleanMark;
// //     });
  
// //   } else {
// //         // console.log("Checking mark fields...");
// //     // const markFields = [
// //     //   item.prevlSRR,
// //     //   item.prevSRR,
// //     //   item.prevCRR3,
// //     //   item.prevCRR2,
// //     //   item.prevCRR1,
// //     // ];

// //     // const hasValidFields = markFields.some(mark =>
// //     //   mark != null && mark !== "" && cleanMarks(mark) > 0
// //     // );
// //     // if (!hasValidFields) return false;

// //     // return markFields.some(mark => {
// //     //   if (mark == null || mark === "") return false;
// //     //   const cleanMark = cleanMarks(mark);
// //     //   return rank >= cleanMark;
// //     // });
// //     // More lenient mark filtering
// //     const markFields = [
// //       item.prevlSRR,
// //       item.prevSRR,
// //       item.prevCRR3,
// //       item.prevCRR2,
// //       item.prevCRR1,
// //     ].filter(mark => mark != null && mark !== "");

// //     // If no valid marks at all, exclude
// //     if (markFields.length === 0) return false;

// //     // Check against only valid marks
// //     return markFields.some(mark => {
// //       const cleanMar = cleanMark(mark);
// //       return cleanMark > 0 && rank >= cleanMark;
// //     });
// //   }
// // });

// // console.log(data)
// // console.log(filteredData)

// const filteredData = data.filter(item => {
//   if (rank <= 0) return true; // No filter

//   if (rankType === "RANK") {
//     const bestRank = getBestRank(item);
//     return bestRank !== Infinity && rank <= bestRank;
//   } else {
//     const bestMark = getBestMark(item);
//     return bestMark !== -Infinity && rank >= bestMark;
//   }
// });

// // const sortedData = [...filteredData].sort((a, b) => {
// //   if (rankType === "RANK") {
// //     // Get the smallest valid rank from each item (lower rank = better/closed first)
// //     const minA = Math.min(
// //       ...[a.prevLastStrayRound, a.prevStrayRound, a.prevClosingRankR3, a.prevClosingRankR2, a.prevClosingRankR1]
// //         .map(r => cleanRank(r))
// //         .filter(r => r > 0)
// //     );
// //     const minB = Math.min(
// //       ...[b.prevLastStrayRound, b.prevStrayRound, b.prevClosingRankR3, b.prevClosingRankR2, b.prevClosingRankR1]
// //         .map(r => cleanRank(r))
// //         .filter(r => r > 0)
// //     );
// //     return minA - minB; // ascending → lower (closed) ranks first
// //   } else {
// //     // For marks/percentile (higher is better → show those first)
// //     const maxA = Math.max(
// //       ...[a.prevlSRR, a.prevSRR, a.prevCRR3, a.prevCRR2, a.prevCRR1]
// //         .map(m => cleanMark(m))
// //         .filter(m => m > 0)
// //     );
// //     const maxB = Math.max(
// //       ...[b.prevlSRR, b.prevSRR, b.prevCRR3, b.prevCRR2, b.prevCRR1]
// //         .map(m => cleanMark(m))
// //         .filter(m => m > 0)
// //     );
// //     return maxB - maxA; // descending → higher marks first
// //   }
// // });
//     // Sort the filtered data
//     // const sortedData = [...filteredData].sort((a, b) => {
//     //   return rankType === "RANK"
//     //     ? getBestRank(a) - getBestRank(b) || a.instituteName.localeCompare(b.instituteName)
//     //     : getBestMark(b) - getBestMark(a) || a.instituteName.localeCompare(b.instituteName);
//     // });


// // const sortedData = [...filteredData].sort((a, b) => {
// //   return rankType?.toUpperCase() === "RANK"
// //     ? bestRank(a) - bestRank(b)
// //     : bestMark(b) - bestMark(a);
// // });
// // const sortedData = [...filteredData].sort((a, b) => {
// //   if (rankType === "RANK") {
// //     return getBestRank(a) - getBestRank(b); // ascending, better rank first
// //   } else {
// //     return getBestMark(b) - getBestMark(a); // descending, better mark first
// //   }
// // });


// // const sortedData = [...filteredData].sort((a, b) => {
// //   if (rankType === "RANK") {
// //     const aBest = getBestRank(a);
// //     const bBest = getBestRank(b);
// //     if (aBest === bBest) {
// //       // Fallback: alphabetically, case-insensitive
// //       return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" });
// //     }
// //     // Special: show valid ranks before "no ranks"
// //     if (aBest === Infinity) return 1;
// //     if (bBest === Infinity) return -1;
// //     return aBest - bBest; // Lower value is better
// //   } else {
// //     const aBest = getBestMark(a);
// //     const bBest = getBestMark(b);
// //     if (aBest === bBest) {
// //       // Fallback: alphabetically, case-insensitive
// //       return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" });
// //     }
// //     // Special: show valid marks before "no marks"
// //     if (aBest === -Infinity) return 1;
// //     if (bBest === -Infinity) return -1;
// //     return bBest - aBest; // Higher value is better
// //   }
// // });


// const sortedData = [...filteredData].sort((a, b) => {
//   if (rankType === "RANK") {
//     const aBest = getBestRank(a);
//     const bBest = getBestRank(b);
//     if (aBest === bBest) {
//       return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" });
//     }
//     if (aBest === Infinity) return 1;
//     if (bBest === Infinity) return -1;
//     return aBest - bBest;
//   } else {
//     const aBest = getBestMark(a);
//     const bBest = getBestMark(b);
//     if (aBest === bBest) {
//       return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" });
//     }
//     if (aBest === -Infinity) return 1;
//     if (bBest === -Infinity) return -1;
//     return aBest - bBest; // ASCENDING: lower marks (like 247) come before higher (like 348)
//   }
// });


//   const responseData = sortedData.map((item) => {
//     const baseData = {
//       id: item.id,
//       created_at: item.created_at,
//       instituteType: item.instituteType,
//       instituteName: item.instituteName,
//       quota: item.quota,
//       category: item.category,
//       course: item.course,
//       courseType: item.courseType,
//       fees: item.fees,
//       subQuota: item.subQuota,
//       subCategory: item.subCategory,
//       ...(stateCode?.toLowerCase() === "all" && { state: item.state }),

//     };

//     if (paymentStatus) {
//       return {
//         ...baseData,
//         showClosingRankR1: item.closingRankR1
//           ? `${item.closingRankR1}/${item.cRR1}`
//           : null,
//         showClosingRankR2: item.closingRankR2
//           ? `${item.closingRankR2}/${item.cRR2}`
//           : null,
//         showClosingRankR3: item.closingRankR3
//           ? `${item.closingRankR3}/${item.cRR3}`
//           : null,
//         showStrayRound: item.strayRound
//           ? `${item.strayRound}/${item.sRR}`
//           : null,
//         showLastStrayRound: item.lastStrayRound
//           ? `${item.lastStrayRound}/${item.lSRR}`
//           : null,
//         showPrevClosingRankR1: item.prevClosingRankR1
//           ? `${item.prevClosingRankR1}/${item.prevCRR1}`
//           : null,
//         showPrevClosingRankR2: item.prevClosingRankR2
//           ? `${item.prevClosingRankR2}/${item.prevCRR2}`
//           : null,
//         showPrevClosingRankR3: item.prevClosingRankR3
//           ? `${item.prevClosingRankR3}/${item.prevCRR3}`
//           : null,
//         showPrevStrayRound: item.prevStrayRound
//           ? `${item.prevStrayRound}/${item.prevSRR}`
//           : null,
//         showPrevLastStrayRound: item.prevLastStrayRound
//           ? `${item.prevLastStrayRound}/${item.prevlSRR}`
//           : null,
//       };
//     } else {
//       return {
//         ...baseData,
//         showClosingRankR1: item.closingRankR1
//           ? `${item.closingRankR1}/${item.cRR1}`
//           : null,
//         showClosingRankR2: null,
//         showClosingRankR3: null,
//         showStrayRound: null,
//         showLastStrayRound: null,
//         showPrevClosingRankR1: item.prevClosingRankR1
//           ? `${item.prevClosingRankR1}/${item.prevCRR1}`
//           : null,
//         showPrevClosingRankR2: null,
//         showPrevClosingRankR3: null,
//         showPrevStrayRound: null,
//         showPrevLastStrayRound: null,
//       };
//     }
//   });

//   // Pagination
//   // const totalItems = responseData.length;
//   // const totalPages = Math.ceil(totalItems / pageSize);
//   // const paginatedData = responseData.slice((page - 1) * pageSize, page * pageSize);




//    // Handle pagination differently based on payment status
//   let paginatedData;
//   let totalItems;
//   let totalPages;

//   if (paymentStatus) {
//     // Normal pagination for paid users
//     totalItems = responseData.length;
//     totalPages = Math.ceil(totalItems / pageSize);
//     paginatedData = responseData.slice((page - 1) * pageSize, page * pageSize);
//   } else {
//     // Free users get only first 5 results
//     totalItems = 5;
//     totalPages = 1;
//     paginatedData = responseData.slice(0, 5); // Only first 5 items
//   }
//   return NextResponse.json({
//     data: paginatedData,
//     currentPage: page,
//     pageSize,
//     totalItems,
//     totalPages,
//   });
// }

// // function cleanRanks(ranks: string): number {
// //   return Number(ranks) || 0;
// // }

// // function cleanMarks(marks: any): number {
// //   const value = Number(marks);
// //   return isNaN(value) || value <= 0 ? Infinity : value;
// // }
// // function bestRank(item: any): number {
// //   const values = [item.prevLastStrayRound, item.prevStrayRound, item.prevClosingRankR3, item.prevClosingRankR2, item.prevClosingRankR1]
// //     .map(cleanRanks)
// //     .filter(r => r > 0);
// //   return values.length > 0 ? Math.min(...values) : Infinity;
// // }

// // function bestMark(item: any): number {
// //   const values = [item.prevlSRR, item.prevSRR, item.prevCRR3, item.prevCRR2, item.prevCRR1]
// //     .map(cleanMarks)
// //     .filter(m => m > 0);
// //   return values.length > 0 ? Math.max(...values) : -Infinity;
// // }



// // Always return a usable numeric value
// // function cleanRank(val: any): number {
// //   const num = Number(val);
// //   return isNaN(num) || num <= 0 ? Infinity : num; // invalid → Infinity (worst rank)
// // }

// // function cleanMark(val: any): number {
// //   const num = Number(val);
// //   return isNaN(num) || num <= 0 ? -Infinity : num; // invalid → -Infinity (worst mark)
// // }
// function getBestRank(item: any): number {
//   const ranks = [
//     item.prevLastStrayRound,
//     item.prevStrayRound,
//     item.prevClosingRankR3,
//     item.prevClosingRankR2,
//     item.prevClosingRankR1,
//   ].map(cleanRank);
//   // Exclude Infinity; Infinity means "no value found"
//   const validRanks = ranks.filter(r => r !== Infinity);
//   return validRanks.length ? Math.min(...validRanks) : Infinity;
// }

// function getBestMark(item: any): number {
//   const marks = [
//     item.prevlSRR,
//     item.prevSRR,
//     item.prevCRR3,
//     item.prevCRR2,
//     item.prevCRR1,
//   ].map(cleanMark);
//   // Exclude -Infinity; -Infinity means "no value found"
//   const validMarks = marks.filter(m => m !== -Infinity);
//   return validMarks.length ? Math.max(...validMarks) : -Infinity;
// }

// function cleanRank(val: any): number {
//   const num = Number(val);
//   // Only treat positive numbers as valid ranks; everything else is "worst"
//   return isNaN(num) || num <= 0 ? Infinity : num;
// }
// function cleanMark(val: any): number {
//   const num = Number(val);
//   // Only treat positive numbers as valid marks; everything else is "worst"
//   return isNaN(num) || num <= 0 ? -Infinity : num;
// }



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
    if (stateCode.toLowerCase() === "all") return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  }
  return "college_table_all_india"
}

const getFilterValues = (param: string[] | string | null): string[] => {
  if (!param) return []

  if (Array.isArray(param)) {
    return param
      .map(item => item.trim())
      .filter(item => item && item !== "null" && item !== "undefined")
  }

  return param
    .split(",")
    .map(item => item.trim())
    .filter(item => item && item !== "null" && item !== "undefined")
}

// Helper: clean rank - valid positive numbers, else Infinity (worst)
function cleanRank(val: any): number {
  const num = Number(val)
  return isNaN(num) || num <= 0 ? Infinity : num
}

// Helper: clean mark - valid positive numbers, else -Infinity (worst)
function cleanMark(val: any): number {
  const num = Number(val)
  return isNaN(num) || num <= 0 ? -Infinity : num
}

// Get best rank (lowest valid rank)
function getBestRank(item: any): number {
  const ranks = [
    item.prevLastStrayRound,
    item.prevStrayRound,
    item.prevClosingRankR3,
    item.prevClosingRankR2,
    item.prevClosingRankR1,
  ].map(cleanRank)
  const validRanks = ranks.filter(r => r !== Infinity)
  return validRanks.length ? Math.min(...validRanks) : Infinity
}

// Get best mark (lowest valid mark per your requirement)
function getBestMark(item: any): number {
  const marks = [
    item.prevlSRR,
    item.prevSRR,
    item.prevCRR3,
    item.prevCRR2,
    item.prevCRR1,
  ].map(cleanMark)
  const validMarks = marks.filter(m => m !== -Infinity)
  // Use Math.min here for lowest mark first (per last requirement)
  return validMarks.length ? Math.min(...validMarks) : -Infinity
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination parameters
  let page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const paymentStatus = searchParams.get("paymentStatus") === "true"

  if (!paymentStatus) {
    page = 1
  }

  // Search and filter parameters
  const rank = parseInt(searchParams.get("rank") || "0")
  const stateCode = searchParams.get("stateCode")
  const rankType = searchParams.get("rankType")?.toString()?.toUpperCase()
  const courseType = searchParams.get("courseType")?.toString()?.toUpperCase()
  const course = searchParams.get("course")
  const quota = searchParams.get("quota")
  const category = searchParams.get("category")

  // Get filter values arrays
  const categoryFilter = getFilterValues(searchParams.getAll("category[]"))
  const instituteTypeFilter = getFilterValues(searchParams.getAll("instituteType[]"))
  const quotaFilter = getFilterValues(searchParams.getAll("quota[]"))
  const courseFilter = getFilterValues(searchParams.getAll("course[]"))

  const feeFrom = parseInt(searchParams.get("feeFrom") || "0")
  const feeToRaw = searchParams.get("feeTo")
  const feeTo = feeToRaw === null ? Infinity : parseInt(feeToRaw)

  const tableName = getTableName(stateCode)
  const supabase = createAdminSupabaseClient()

  // Build Supabase query with filters
  let query = supabase.from(tableName).select("*").order("created_at", { ascending: false })

  if (courseFilter.length > 0) {
    query = query.in("course", courseFilter)
  } else if (course) {
    query = query.eq("course", course.trim())
  }

  if (courseType) {
    query = query.eq("courseType", courseType)
  }

  if (quotaFilter.length > 0) {
    query = query.in("quota", quotaFilter)
  } else if (quota) {
    query = query.eq("quota", quota)
  }

  if (categoryFilter.length > 0) {
    query = query.in("category", categoryFilter)
  } else if (category) {
    query = query.eq("category", category)
  }

  if (instituteTypeFilter.length > 0) {
    query = query.in("instituteType", instituteTypeFilter)
  }

  if (feeFrom || feeTo !== Infinity) {
    query = query.gte("fees", feeFrom).lte("fees", feeTo)
  }

  // Execute query
  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  // Filter based on rank or marks
  const filteredData = data.filter(item => {
    if (rank <= 0) return true

    if (rankType === "RANK") {
      const bestRank = getBestRank(item)
      return bestRank !== Infinity && rank <= bestRank
    } else {
      const bestMark = getBestMark(item)
      return bestMark !== -Infinity && rank >= bestMark
    }
  })

  // Sort filtered data by rank or mark ascending, fallback alphabetical
  const sortedData = [...filteredData].sort((a, b) => {
    if (rankType === "RANK") {
      const aBest = getBestRank(a)
      const bBest = getBestRank(b)
      if (aBest === bBest) {
        return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" })
      }
      if (aBest === Infinity) return 1
      if (bBest === Infinity) return -1
      return aBest - bBest
    } else {
      const aBest = getBestMark(a)
      const bBest = getBestMark(b)
      if (aBest === bBest) {
        return a.instituteName.localeCompare(b.instituteName, undefined, { sensitivity: "base" })
      }
      if (aBest === -Infinity) return 1
      if (bBest === -Infinity) return -1
      return aBest - bBest // Ascending per your requirement (lowest mark first)
    }
  })

  // Map for response, conditionally show ranks & marks fields based on payment
  const responseData = sortedData.map(item => {
    const baseData = {
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
      ...(stateCode?.toLowerCase() === "all" && { state: item.state }),
    }

    if (paymentStatus) {
      return {
        ...baseData,
        showClosingRankR1: item.closingRankR1 ? `${item.closingRankR1}/${item.cRR1}` : null,
        showClosingRankR2: item.closingRankR2 ? `${item.closingRankR2}/${item.cRR2}` : null,
        showClosingRankR3: item.closingRankR3 ? `${item.closingRankR3}/${item.cRR3}` : null,
        showStrayRound: item.strayRound ? `${item.strayRound}/${item.sRR}` : null,
        showLastStrayRound: item.lastStrayRound ? `${item.lastStrayRound}/${item.lSRR}` : null,
        showPrevClosingRankR1: item.prevClosingRankR1 ? `${item.prevClosingRankR1}/${item.prevCRR1}` : null,
        showPrevClosingRankR2: item.prevClosingRankR2 ? `${item.prevClosingRankR2}/${item.prevCRR2}` : null,
        showPrevClosingRankR3: item.prevClosingRankR3 ? `${item.prevClosingRankR3}/${item.prevCRR3}` : null,
        showPrevStrayRound: item.prevStrayRound ? `${item.prevStrayRound}/${item.prevSRR}` : null,
        showPrevLastStrayRound: item.prevLastStrayRound ? `${item.prevLastStrayRound}/${item.prevlSRR}` : null,
      }
    } else {
      return {
        ...baseData,
        showClosingRankR1: item.closingRankR1 ? `${item.closingRankR1}/${item.cRR1}` : null,
        showClosingRankR2: null,
        showClosingRankR3: null,
        showStrayRound: null,
        showLastStrayRound: null,
        showPrevClosingRankR1: item.prevClosingRankR1 ? `${item.prevClosingRankR1}/${item.prevCRR1}` : null,
        showPrevClosingRankR2: null,
        showPrevClosingRankR3: null,
        showPrevStrayRound: null,
        showPrevLastStrayRound: null,
      }
    }
  })

  // Pagination
  let paginatedData
  let totalItems
  let totalPages
// console.log("Payment Status: ",paymentStatus)
  if (paymentStatus) {
    totalItems = responseData.length
    totalPages = Math.ceil(totalItems / pageSize)
    paginatedData = responseData.slice((page - 1) * pageSize, page * pageSize)
  } else {
    totalItems =responseData.length
    totalPages = 1
    paginatedData = responseData.slice(0, 5)
  }

  return NextResponse.json({
    data: paginatedData,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  })
}
