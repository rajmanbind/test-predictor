// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// type CollegeRow = {
//   instituteName: string
//   instituteType: string
//   course: string
//   quota: string
//   category: string
//   subQuota?: string | null
//   subCategory?: string | null
//   [key: string]: any
// }

// type BatchStats = {
//   batchNum: number
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   logs: string[]
//   errors: { record: number; error: string; data: CollegeRow }[]
// }

// function getTableName(stateCode?: string | null): string {
//   if (stateCode) {
//     if (stateCode == "All" || stateCode === "all")
//       return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   } else {
//     return "college_table_all_india"
//   }
// }

// function cleanAndTrimValue(value: any) {
//   if (value === "" || value === null || value === undefined) return null

//   if (typeof value === "string") {
//     // Remove extra spaces from start/end and normalize multiple spaces
//     return value.trim().replace(/\s+/g, " ")
//   }

//   if (!isNaN(Number(value)) && typeof value !== "boolean") {
//     return Number(value)
//   }

//   return value
// }

// function cleanAndTrimObject(obj: Record<string, any>): Record<string, any> {
//   const cleaned: Record<string, any> = {}
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       cleaned[key] = cleanAndTrimValue(obj[key])
//     }
//   }
//   return cleaned
// }

// function cleanValue(value: any) {
//   if (value === "") return null
//   if (typeof value === "string" && !isNaN(Number(value))) return Number(value)
//   return value
// }

// function getConflictKey(row: CollegeRow): Record<string, any> {
//   return {
//     instituteName: cleanAndTrimValue(row.instituteName),
//     instituteType: cleanAndTrimValue(row.instituteType),
//     course: cleanAndTrimValue(row.course),
//     quota: cleanAndTrimValue(row.quota),
//     category: cleanAndTrimValue(row.category),
//     subQuota: cleanAndTrimValue(row.subQuota),
//     subCategory: cleanAndTrimValue(row.subCategory),
//   }
// }

// const BATCH_SIZE = 100

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const { data, counsellingType, stateCode } = body as {
//       data: CollegeRow[]
//       counsellingType: string | number
//       stateCode?: string | null
//     }
//     if (!data?.length) {
//       return NextResponse.json({ error: "No data provided" }, { status: 400 })
//     }
//     if (!counsellingType) {
//       return NextResponse.json(
//         { error: "Missing counsellingType" },
//         { status: 400 },
//       )
//     }

//     let tableName: string
//     try {
//       tableName = getTableName(stateCode)
//     } catch (err) {
//       return NextResponse.json(
//         { error: err instanceof Error ? err.message : String(err) },
//         { status: 400 },
//       )
//     }

//     const supabase = createAdminSupabaseClient()

//     // Deduplicate by conflict key
//     const seen = new Set<string>()
//     const dedupedRows: CollegeRow[] = []
//     const invalidRowsBeforeInsert: {
//       index: number
//       reason: string
//       row: CollegeRow
//     }[] = []
//     const requiredFields = [
//       "instituteName",
//       "instituteType",
//       "course",
//       "quota",
//       "category",
//     ]
//     const firstOccurrences = new Map<
//       string,
//       { index: number; row: CollegeRow }
//     >()
//     const skippedDueToDuplicate: {
//       index: number
//       row: CollegeRow
//       duplicateOf: { index: number; row: CollegeRow }
//     }[] = []


//     for (let i = 0; i < data.length; i++) {
//       const row = data[i]
//       const cleanedRow = cleanAndTrimObject(row)

//       const missingFields = requiredFields.filter((field) => !cleanedRow[field])
//       if (missingFields.length > 0) {
//         invalidRowsBeforeInsert.push({
//           index: i + 1,
//           reason: `Missing required fields: ${missingFields.join(", ")}`,
//           row,
//         })
//         continue
//       }

//       const key = JSON.stringify(getConflictKey(cleanedRow))
//       if (!seen.has(key)) {
//         seen.add(key)
//         dedupedRows.push(cleanedRow)
//         firstOccurrences.set(key, { index: i + 1, row: cleanedRow })
//       } else {
//         const original = firstOccurrences.get(key)
//         skippedDueToDuplicate.push({
//           index: i + 1,
//           row: cleanedRow,
//           duplicateOf: {
//             index: original!.index,
//             row: original!.row,
//           },
//         })
//         console.warn(
//           `⚠️ Skipped duplicate at index ${i + 1}:\nDuplicate Row:`,
//           cleanedRow,
//           `\n↪️ Duplicate of index ${original!.index}:\nOriginal Row:`,
//           original!.row,
//         )
//       }
//     }

//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
//     const allBatchStats: BatchStats[] = []
//     const updatedRows: any[] = []
//     const insertedRows: any[] = []

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
//       const batchRows = dedupedRows.slice(startIdx, endIdx)

//       let inserted = 0
//       let updated = 0
//       let failed = 0
//       const logs: string[] = []
//       const errors: { record: number; error: string; data: CollegeRow }[] = []

//       for (let i = 0; i < batchRows.length; i++) {
//         const row = batchRows[i]
//         const recordNum = startIdx + i + 1
//         const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`
//         try {
//           const missingFields = requiredFields.filter((field) => !row[field])
//           if (missingFields.length > 0) {
//             throw new Error(
//               `Missing required fields: ${missingFields.join(", ")}`,
//             )
//           }

//           const conflictKey = getConflictKey(row)
//           const cleanData: CollegeRow = Object.fromEntries(
//             Object.entries(row)
//               .filter(([key]) => key !== "id")
//               .map(([key, value]) => [key, cleanAndTrimValue(value)]),
//           ) as CollegeRow
// // console.log("Data: ",tableName,conflictKey)
// // Try to find existing record by unique key
// const { data: existing } = await supabase
// .from(tableName)
// .select("id")
// .match(conflictKey)
// .maybeSingle()

// console.log("Data: ",existing,conflictKey,tableName)
// if (existing?.id) {
//   console.log("Data: ",existing,conflictKey,tableName)
//             // Update
//             const { error } = await supabase
//               .from(tableName)
//               .update(cleanData)
//               .eq("id", existing.id)

//             if (error) throw error

//             const msg = `${logPrefix} - ✅ UPDATED: ${JSON.stringify(conflictKey)}`
//             updated++
//             logs.push(msg)
//             updatedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           } else {
//             // Insert
//             const { error } = await supabase.from(tableName).insert(cleanData)

//             if (error) throw error

//             const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
//             inserted++
//             logs.push(msg)
//             insertedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           }
//         } catch (error) {
//           failed++
//           const errorMsg =
//             error instanceof Error
//               ? error.message
//               : typeof error === "object" && error !== null
//                 ? JSON.stringify(error)
//                 : String(error)

//           const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
//           logs.push(failMsg)
//           errors.push({
//             record: recordNum,
//             error: errorMsg,
//             data: row,
//           })

//           console.error(failMsg)
//         }
//       }

//       // Batch summary
//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         updated,
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       }

//       allBatchStats.push(batchStats)
//       console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
//       console.log(`🆕 Inserted: ${inserted}`)
//       console.log(`🔄 Updated: ${updated}`)
//       console.log(`❌ Failed: ${failed}`)
//       console.log(`📋 Total in Batch: ${batchRows.length}`)
//     }

//     // Final summary
//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
//     const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)
//     const allLogs = allBatchStats.flatMap((b) => b.logs)

//     console.log("\n📊 Final Summary:")
//     console.log(`🆕 Inserted: ${totalInserted}`)
//     console.log(`🔄 Updated: ${totalUpdated}`)
//     console.log(`❌ Failed: ${totalFailed}`)
//     console.log(`📋 Total Processed: ${dedupedRows.length}`)

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
//       updated: totalUpdated,
//       failed: totalFailed,
//       total: dedupedRows.length,
//       logs: allLogs,
//       batchStats: allBatchStats,
//       skippedDueToDuplicate,
//       updatedRows,
//       insertedRows,
//       invalidBeforeInsert: invalidRowsBeforeInsert,
//     })
//   } catch (err) {
//     console.error("💥 Server-level error:", err)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error",
//         details: err instanceof Error ? err.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }











// import { createAdminSupabaseClient } from "@/lib/supabase"
// import { NextRequest, NextResponse } from "next/server"

// type CollegeRow = {
//   instituteName: string
//   instituteType: string
//   course: string
//   quota: string
//   category: string
//   subQuota?: string | null
//   subCategory?: string | null
//   [key: string]: any
// }

// type BatchStats = {
//   batchNum: number
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   logs: string[]
//   errors: { record: number; error: string; data: CollegeRow }[]
// }

// function getTableName(stateCode?: string | null): string {
//   if (stateCode) {
//     if (stateCode == "All" || stateCode === "all")
//       return "college_table_all_india"
//     return `college_table_${stateCode.toUpperCase()}`
//   } else {
//     return "college_table_all_india"
//   }
// }

// // function cleanAndTrimValue(value: any) {
// //   if (value === "" || value === null || value === undefined) return null
// //   if (typeof value === "string") {
// //     return value.trim().replace(/\s+/g, " ")
// //   }
// //   if (!isNaN(Number(value)) return Number(value)
// //   return value
// // }


// function cleanAndTrimValue(value: any) {
//   if (value === "" || value === null || value === undefined) return null

//   if (typeof value === "string") {
//     // Remove extra spaces from start/end and normalize multiple spaces
//     return value.trim().replace(/\s+/g, " ")
//   }

//   if (!isNaN(Number(value)) && typeof value !== "boolean") {
//     return Number(value)
//   }

//   return value
// }

// function cleanAndTrimObject(obj: Record<string, any>): Record<string, any> {
//   const cleaned: Record<string, any> = {}
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       cleaned[key] = cleanAndTrimValue(obj[key])
//     }
//   }
//   return cleaned
// }

// function getConflictKey(row: CollegeRow): Record<string, any> {
//   const baseKey = {
//     instituteName: cleanAndTrimValue(row.instituteName),
//     instituteType: cleanAndTrimValue(row.instituteType),
//     quota: cleanAndTrimValue(row.quota),
//     category: cleanAndTrimValue(row.category),
//     course: cleanAndTrimValue(row.course),
//   }

//   // Handle all 4 cases based on your database indexes
//   if (row.subQuota && row.subCategory) {
//     return {
//       ...baseKey,
//       subQuota: cleanAndTrimValue(row.subQuota),
//       subCategory: cleanAndTrimValue(row.subCategory),
//     }
//   } else if (row.subQuota) {
//     return {
//       ...baseKey,
//       subQuota: cleanAndTrimValue(row.subQuota),
//     }
//   } else if (row.subCategory) {
//     return {
//       ...baseKey,
//       subCategory: cleanAndTrimValue(row.subCategory),
//     }
//   }
//   return baseKey
// }

// const BATCH_SIZE = 100

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const { data, counsellingType, stateCode } = body as {
//       data: CollegeRow[]
//       counsellingType: string | number
//       stateCode?: string | null
//     }

//     if (!data?.length) {
//       return NextResponse.json({ error: "No data provided" }, { status: 400 })
//     }
//     if (!counsellingType) {
//       return NextResponse.json(
//         { error: "Missing counsellingType" },
//         { status: 400 }
//       )
//     }

//     let tableName: string
//     try {
//       tableName = getTableName(stateCode)
//     } catch (err) {
//       return NextResponse.json(
//         { error: err instanceof Error ? err.message : String(err) },
//         { status: 400 }
//       )
//     }

//     const supabase = createAdminSupabaseClient()

//     // Deduplicate by conflict key
//     const seen = new Set<string>()
//     const dedupedRows: CollegeRow[] = []
//     const invalidRowsBeforeInsert: {
//       index: number
//       reason: string
//       row: CollegeRow
//     }[] = []
//     const requiredFields = [
//       "instituteName",
//       "instituteType",
//       "course",
//       "quota",
//       "category",
//     ]
//     const skippedDueToDuplicate: {
//       index: number
//       row: CollegeRow
//       conflictKey: Record<string, any>
//     }[] = []

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i]
//       const cleanedRow = cleanAndTrimObject(row)

//       const missingFields = requiredFields.filter((field) => !cleanedRow[field])
//       if (missingFields.length > 0) {
//         invalidRowsBeforeInsert.push({
//           index: i + 1,
//           reason: `Missing required fields: ${missingFields.join(", ")}`,
//           row,
//         })
//         continue
//       }

//       const conflictKey = getConflictKey(cleanedRow)
//       const key = JSON.stringify(conflictKey)
      
//       if (!seen.has(key)) {
//         seen.add(key)
//         dedupedRows.push(cleanedRow)
//       } else {
//         skippedDueToDuplicate.push({
//           index: i + 1,
//           row: cleanedRow,
//           conflictKey,
//         })
//         console.warn(
//           `⚠️ Skipped duplicate at index ${i + 1} with conflict key:`,
//           conflictKey
//         )
//       }
//     }

//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
//     const allBatchStats: BatchStats[] = []
//     const updatedRows: any[] = []
//     const insertedRows: any[] = []

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
//       const batchRows = dedupedRows.slice(startIdx, endIdx)

//       let inserted = 0
//       let updated = 0
//       let failed = 0
//       const logs: string[] = []
//       const errors: { record: number; error: string; data: CollegeRow }[] = []

//       for (let i = 0; i < batchRows.length; i++) {
//         const row = batchRows[i]
//         const recordNum = startIdx + i + 1
//         const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`

//         try {
//           const conflictKey = getConflictKey(row)
//           const cleanData: CollegeRow = Object.fromEntries(
//             Object.entries(row)
//               .filter(([key]) => key !== "id")
//               .map(([key, value]) => [key, cleanAndTrimValue(value)])
//           ) as CollegeRow

//           // Try to find existing record by unique key
//           const { data: existing } = await supabase
//             .from(tableName)
//             .select("id")
//             .match(conflictKey)
//             .maybeSingle()

//           if (existing?.id) {
//             // Update existing record
//             const { error } = await supabase
//               .from(tableName)
//               .update(cleanData)
//               .eq("id", existing.id)

//             if (error) throw error

//             const msg = `${logPrefix} - ✅ UPDATED: ${JSON.stringify(conflictKey)}`
//             updated++
//             logs.push(msg)
//             updatedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           } else {
//             // Insert new record
//             const { error } = await supabase.from(tableName).insert(cleanData)

//             if (error) throw error

//             const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
//             inserted++
//             logs.push(msg)
//             insertedRows.push({ index: recordNum, row, conflictKey })
//             console.log(msg)
//           }
//         } catch (error) {
//           failed++
//           const errorMsg =
//             error instanceof Error
//               ? error.message
//               : typeof error === "object" && error !== null
//                 ? JSON.stringify(error)
//                 : String(error)

//           const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
//           logs.push(failMsg)
//           errors.push({
//             record: recordNum,
//             error: errorMsg,
//             data: row,
//           })

//           console.error(failMsg)
//         }
//       }

//       // Batch summary
//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         updated,
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       }

//       allBatchStats.push(batchStats)
//       console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
//       console.log(`🆕 Inserted: ${inserted}`)
//       console.log(`🔄 Updated: ${updated}`)
//       console.log(`❌ Failed: ${failed}`)
//       console.log(`📋 Total in Batch: ${batchRows.length}`)
//     }

//     // Final summary
//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
//     const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)

//     console.log("\n📊 Final Summary:")
//     console.log(`🆕 Inserted: ${totalInserted}`)
//     console.log(`🔄 Updated: ${totalUpdated}`)
//     console.log(`❌ Failed: ${totalFailed}`)
//     console.log(`📋 Total Processed: ${dedupedRows.length}`)

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
//       updated: totalUpdated,
//       failed: totalFailed,
//       total: dedupedRows.length,
//       batchStats: allBatchStats,
//       skippedDueToDuplicate,
//       updatedRows,
//       insertedRows,
//       invalidBeforeInsert: invalidRowsBeforeInsert,
//     })
//   } catch (err) {
//     console.error("💥 Server-level error:", err)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error",
//         details: err instanceof Error ? err.message : "Unknown error",
//       },
//       { status: 500 }
//     )
//   }
// }












import { createAdminSupabaseClient } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

type CollegeRow = {
  instituteName: string
  instituteType: string
  course: string
  quota: string
  category: string
  subQuota?: string | null
  subCategory?: string | null
  [key: string]: any
}

type BatchStats = {
  batchNum: number
  inserted: number
  updated: number
  failed: number
  total: number
  logs: string[]
  errors: { record: number; error: string; data: CollegeRow }[]
}

type SkippedDuplicate = {
  index: number
  row: CollegeRow
  conflictKey: Record<string, any>
}

type InvalidRow = {
  index: number
  reason: string
  row: CollegeRow
}

function getTableName(stateCode?: string | null): string {
  if (stateCode) {
    if (stateCode == "All" || stateCode === "all")
      return "college_table_all_india"
    return `college_table_${stateCode.toUpperCase()}`
  } else {
    return "college_table_all_india"
  }
}

function cleanAndTrimValue(value: any): any {
  if (value === "" || value === null || value === undefined) return null
  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ")
  }
  if (!isNaN(Number(value)) && typeof value !== "boolean") {
    return Number(value)
  }
  return value
}

// function cleanAndTrimObject(obj: Record<string, any>): Record<string, any> {
//   const cleaned: Record<string, any> = {}
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       cleaned[key] = cleanAndTrimValue(obj[key])
//     }
//   }
//   return cleaned
// }

function cleanAndTrimObject(obj: CollegeRow): CollegeRow {
  const cleaned: CollegeRow = {
    instituteName: "",
    instituteType: "",
    course: "",
    quota: "",
    category: "",
    subQuota: null,
    subCategory: null,
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleaned[key as keyof CollegeRow] = cleanAndTrimValue(obj[key])
    }
  }
  return cleaned
}
function getConflictKey(row: CollegeRow): Record<string, any> {
  const baseKey = {
    instituteName: cleanAndTrimValue(row.instituteName),
    instituteType: cleanAndTrimValue(row.instituteType),
    quota: cleanAndTrimValue(row.quota),
    category: cleanAndTrimValue(row.category),
    course: cleanAndTrimValue(row.course),
  }
  if (row.subQuota && row.subCategory) {
    return {
      ...baseKey,
      subQuota: cleanAndTrimValue(row.subQuota),
      subCategory: cleanAndTrimValue(row.subCategory),
    }
  } else if (row.subQuota) {
    return {
      ...baseKey,
      subQuota: cleanAndTrimValue(row.subQuota),
    }
  } else if (row.subCategory) {
    return {
      ...baseKey,
      subCategory: cleanAndTrimValue(row.subCategory),
    }
  }
  return baseKey
}

const BATCH_SIZE = 100

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, counsellingType, stateCode } = body as {
      data: CollegeRow[]
      counsellingType: string | number
      stateCode?: string | null
    }

    if (!data?.length) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }
    if (!counsellingType) {
      return NextResponse.json(
        { error: "Missing counsellingType" },
        { status: 400 }
      )
    }

    let tableName: string
    try {
      tableName = getTableName(stateCode)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : String(err) },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Deduplicate by conflict key
    const seen = new Set<string>()
    const dedupedRows: CollegeRow[] = []
    const invalidRowsBeforeInsert: InvalidRow[] = []
    const requiredFields = [
      "instituteName",
      "instituteType",
      "course",
      "quota",
      "category",
    ]
    const skippedDueToDuplicate: SkippedDuplicate[] = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const cleanedRow = cleanAndTrimObject(row)

      const missingFields = requiredFields.filter((field) => !cleanedRow[field])
      if (missingFields.length > 0) {
        invalidRowsBeforeInsert.push({
          index: i + 1,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
          row,
        })
        continue
      }

      const conflictKey = getConflictKey(cleanedRow)
      const key = JSON.stringify(conflictKey)

      if (!seen.has(key)) {
        seen.add(key)
        dedupedRows.push(cleanedRow)
      } else {
        skippedDueToDuplicate.push({
          index: i + 1,
          row: cleanedRow,
          conflictKey,
        })
        console.warn(
          `⚠️ Skipped duplicate at index ${i + 1} with conflict key:`,
          conflictKey
        )
      }
    }

    const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
    const allBatchStats: BatchStats[] = []
    const updatedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []
    const insertedRows: { index: number; row: CollegeRow; conflictKey: Record<string, any> }[] = []

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
      const startIdx = batchNum * BATCH_SIZE
      const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
      const batchRows = dedupedRows.slice(startIdx, endIdx)

      let inserted = 0
      let updated = 0
      let failed = 0
      const logs: string[] = []
      const errors: { record: number; error: string; data: CollegeRow }[] = []

      for (let i = 0; i < batchRows.length; i++) {
        const row = batchRows[i]
        const recordNum = startIdx + i + 1
        const logPrefix = `Batch ${batchNum + 1} - Record ${recordNum}/${dedupedRows.length}`

        try {
          const conflictKey = getConflictKey(row)
          const cleanData: CollegeRow = Object.fromEntries(
            Object.entries(row)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => [key, cleanAndTrimValue(value)])
          ) as CollegeRow

          // Try to find existing record by unique key
          const { data: existing } = await supabase
            .from(tableName)
            .select("id")
            .match(conflictKey)
            .maybeSingle()

          if (existing?.id) {
            // Update existing record
            const { error } = await supabase
              .from(tableName)
              .update(cleanData)
              .eq("id", existing.id)

            if (error) throw error

            const msg = `${logPrefix} - ✅ UPDATED: ${JSON.stringify(conflictKey)}`
            updated++
            logs.push(msg)
            updatedRows.push({ index: recordNum, row, conflictKey })
            console.log(msg)
          } else {
            // Insert new record
            const { error } = await supabase.from(tableName).insert(cleanData)

            if (error) throw error

            const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
            inserted++
            logs.push(msg)
            insertedRows.push({ index: recordNum, row, conflictKey })
            console.log(msg)
          }
        } catch (error: any) {
          failed++
          const errorMsg =
            error instanceof Error
              ? error.message
              : typeof error === "object" && error !== null
                ? JSON.stringify(error)
                : String(error)

          const failMsg = `${logPrefix} - ❌ Failed: ${errorMsg}`
          logs.push(failMsg)
          errors.push({
            record: recordNum,
            error: errorMsg,
            data: row,
          })

          console.error(failMsg)
        }
      }

      // Batch summary
      const batchStats: BatchStats = {
        batchNum: batchNum + 1,
        inserted,
        updated,
        failed,
        total: batchRows.length,
        logs,
        errors,
      }

      allBatchStats.push(batchStats)
      console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
      console.log(`🆕 Inserted: ${inserted}`)
      console.log(`🔄 Updated: ${updated}`)
      console.log(`❌ Failed: ${failed}`)
      console.log(`📋 Total in Batch: ${batchRows.length}`)
    }

    // Final summary
    const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
    const totalUpdated = allBatchStats.reduce((sum, b) => sum + b.updated, 0)
    const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)

    console.log("\n📊 Final Summary:")
    console.log(`🆕 Inserted: ${totalInserted}`)
    console.log(`🔄 Updated: ${totalUpdated}`)
    console.log(`❌ Failed: ${totalFailed}`)
    console.log(`📋 Total Processed: ${dedupedRows.length}`)

    return NextResponse.json({
      success: totalFailed === 0,
      inserted: totalInserted,
      updated: totalUpdated,
      failed: totalFailed,
      total: dedupedRows.length,
      batchStats: allBatchStats,
      skippedDueToDuplicate,
      updatedRows,
      insertedRows,
      invalidBeforeInsert: invalidRowsBeforeInsert,
    })
  } catch (err: any) {
    console.error("💥 Server-level error:", err)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}