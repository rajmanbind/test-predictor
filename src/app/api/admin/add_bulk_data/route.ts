


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

function getTableName(
  counsellingType: string | number,
  stateCode?: string | null,
): string {
  const isAllIndia =
    counsellingType === "All India Counselling" ||
    counsellingType === 1 ||
    counsellingType === "1"
  if (
    isAllIndia &&
    (!stateCode ||
      stateCode === "null" ||
      stateCode === "undefined" ||
      stateCode === "")
  ) {
    return "college_table_all_india"
  }
  if (
    stateCode &&
    stateCode !== "null" &&
    stateCode !== "undefined" &&
    stateCode !== ""
  ) {
    return `college_table_${stateCode}`
  }
  throw new Error(
    "Table name cannot be determined (invalid counsellingType/stateCode).",
  )
}

function cleanAndTrimValue(value: any) {
  if (value === "" || value === null || value === undefined) return null

  if (typeof value === "string") {
    // Remove extra spaces from start/end and normalize multiple spaces
    return value.trim().replace(/\s+/g, " ")
  }

  if (!isNaN(Number(value)) && typeof value !== "boolean") {
    return Number(value)
  }

  return value
}

function cleanAndTrimObject(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleaned[key] = cleanAndTrimValue(obj[key])
    }
  }
  return cleaned
}

function cleanValue(value: any) {
  if (value === "") return null
  if (typeof value === "string" && !isNaN(Number(value))) return Number(value)
  return value
}

function getConflictKey(row: CollegeRow): Record<string, any> {
      return {
    instituteName: cleanAndTrimValue(row.instituteName),
    instituteType: cleanAndTrimValue(row.instituteType),
    course: cleanAndTrimValue(row.course),
    quota: cleanAndTrimValue(row.quota),
    category: cleanAndTrimValue(row.category),
    subQuota: cleanAndTrimValue(row.subQuota),
    subCategory: cleanAndTrimValue(row.subCategory),
  }
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
        { status: 400 },
      )
    }

    let tableName: string
    try {
      tableName = getTableName(counsellingType, stateCode)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : String(err) },
        { status: 400 },
      )
    }

    const supabase = createAdminSupabaseClient()

    // Deduplicate by conflict key
    const seen = new Set<string>()
    const dedupedRows: CollegeRow[] = []
    const invalidRowsBeforeInsert: {
      index: number
      reason: string
      row: CollegeRow
    }[] = []
    const requiredFields = [
      "instituteName",
      "instituteType",
      "course",
      "quota",
      "category",
    ]
    const firstOccurrences = new Map<
      string,
      { index: number; row: CollegeRow }
    >()
    const skippedDueToDuplicate: {
      index: number
      row: CollegeRow
      duplicateOf: { index: number; row: CollegeRow }
    }[] = []

    // for (let i = 0; i < data.length; i++) {
    //   const row = data[i]
    //   const missingFields = requiredFields.filter((field) => !row[field])
    //   if (missingFields.length > 0) {
    //     invalidRowsBeforeInsert.push({
    //       index: i + 1,
    //       reason: `Missing required fields: ${missingFields.join(", ")}`,
    //       row,
    //     })
    //     continue
    //   }
    //   const key = JSON.stringify(getConflictKey(row))
    //   if (!seen.has(key)) {
    //     seen.add(key)
    //     dedupedRows.push(row)
    //     firstOccurrences.set(key, { index: i + 1, row })
    //   } else {
    //     const original = firstOccurrences.get(key)
    //     skippedDueToDuplicate.push({
    //       index: i + 1,
    //       row: row,
    //       duplicateOf: {
    //         index: original!.index,
    //         row: original!.row,
    //       },
    //     })
    //     // Optionally log
    //     console.warn(
    //       `⚠️ Skipped duplicate at index ${i + 1}:\nDuplicate Row:`,
    //       row,
    //       `\n↪️ Duplicate of index ${original!.index}:\nOriginal Row:`,
    //       original!.row,
    //     )
    //   }
    // }

    // Batch processing
    
    
    
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

  const key = JSON.stringify(getConflictKey(cleanedRow))
  if (!seen.has(key)) {
    seen.add(key)
    dedupedRows.push(cleanedRow)
    firstOccurrences.set(key, { index: i + 1, row: cleanedRow })
  } else {
    const original = firstOccurrences.get(key)
    skippedDueToDuplicate.push({
      index: i + 1,
      row: cleanedRow,
      duplicateOf: {
        index: original!.index,
        row: original!.row,
      },
    })
    console.warn(
      `⚠️ Skipped duplicate at index ${i + 1}:\nDuplicate Row:`,
      cleanedRow,
      `\n↪️ Duplicate of index ${original!.index}:\nOriginal Row:`,
      original!.row,
    )
  }
}

    const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
    const allBatchStats: BatchStats[] = []
    const updatedRows: any[] = []
    const insertedRows: any[] = []

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
          const missingFields = requiredFields.filter((field) => !row[field])
          if (missingFields.length > 0) {
            throw new Error(
              `Missing required fields: ${missingFields.join(", ")}`,
            )
          }

          const conflictKey = getConflictKey(row)
          // const cleanData: CollegeRow = Object.fromEntries(
          //   Object.entries(row)
          //     .filter(([key]) => key !== "id")
          //     .map(([key, value]) => [key, cleanValue(value)]),
          // ) as CollegeRow

const cleanData: CollegeRow = Object.fromEntries(
  Object.entries(row)
    .filter(([key]) => key !== "id")
    .map(([key, value]) => [key, cleanAndTrimValue(value)]),
) as CollegeRow


          // Try to find existing record by unique key
          const { data: existing } = await supabase
            .from(tableName)
            .select("id")
            .match(conflictKey)
            .maybeSingle()

          if (existing?.id) {
            // Update
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
            // Insert
            const { error } = await supabase.from(tableName).insert(cleanData)

            if (error) throw error

            const msg = `${logPrefix} - 🆕 INSERTED: ${JSON.stringify(conflictKey)}`
            inserted++
            logs.push(msg)
            insertedRows.push({ index: recordNum, row, conflictKey })
            console.log(msg)
          }
        } catch (error) {
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
    const allLogs = allBatchStats.flatMap((b) => b.logs)

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
      logs: allLogs,
      batchStats: allBatchStats,
      skippedDueToDuplicate,
      updatedRows,
      insertedRows,
      invalidBeforeInsert: invalidRowsBeforeInsert,
    })
  } catch (err) {
    console.error("💥 Server-level error:", err)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}




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

// function getTableName(
//   counsellingType: string | number,
//   stateCode?: string | null,
// ): string {
//   const isAllIndia =
//     counsellingType === "All India Counselling" ||
//     counsellingType === 1 ||
//     counsellingType === "1"
//   if (
//     isAllIndia &&
//     (!stateCode ||
//       stateCode === "null" ||
//       stateCode === "undefined" ||
//       stateCode === "")
//   ) {
//     return "college_table_all_india"
//   }
//   if (
//     stateCode &&
//     stateCode !== "null" &&
//     stateCode !== "undefined" &&
//     stateCode !== ""
//   ) {
//     return `college_table_${stateCode}`
//   }
//   throw new Error(
//     "Table name cannot be determined (invalid counsellingType/stateCode).",
//   )
// }

// function cleanAndTrimValue(value: any) {
//   if (value === "" || value === null || value === undefined) return null

//   if (typeof value === "string") {
//     return value.trim().replace(/\s+/g, " ")
//   }

//   if (!isNaN(Number(value)) && typeof value !== "boolean") {
//     return Number(value)
//   }

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
//       tableName = getTableName(counsellingType, stateCode)
//     } catch (err) {
//       return NextResponse.json(
//         { error: err instanceof Error ? err.message : String(err) },
//         { status: 400 },
//       )
//     }

//     const supabase = createAdminSupabaseClient()

//     // Deduplicate by conflict key locally
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
//       const missingFields = requiredFields.filter((field) => !row[field])
//       if (missingFields.length > 0) {
//         invalidRowsBeforeInsert.push({
//           index: i + 1,
//           reason: `Missing required fields: ${missingFields.join(", ")}`,
//           row,
//         })
//         continue
//       }
//       const key = JSON.stringify(getConflictKey(row))
//       if (!seen.has(key)) {
//         seen.add(key)
//         dedupedRows.push(row)
//         firstOccurrences.set(key, { index: i + 1, row })
//       } else {
//         const original = firstOccurrences.get(key)
//         skippedDueToDuplicate.push({
//           index: i + 1,
//           row: row,
//           duplicateOf: {
//             index: original!.index,
//             row: original!.row,
//           },
//         })
//         console.warn(
//           `⚠️ Skipped duplicate at index ${i + 1}:\nDuplicate Row:`,
//           row,
//           `\n↪️ Duplicate of index ${original!.index}:\nOriginal Row:`,
//           original!.row,
//         )
//       }
//     }

//     // Batch processing
//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
//     const allBatchStats: BatchStats[] = []
//     const updatedRows: any[] = []
//     const insertedRows: any[] = []

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length)
//       const batchRows = dedupedRows.slice(startIdx, endIdx)

//       let inserted = 0
//       const updated = 0
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

//           // Clean row data
//           const cleanData: CollegeRow = Object.fromEntries(
//             Object.entries(row)
//               .filter(([key]) => key !== "id")
//               .map(([key, value]) => [key, cleanAndTrimValue(value)]),
//           ) as CollegeRow

//           // Build onConflict keys dynamically (exclude null/undefined keys)
//   //         const conflictKeys = [
//   //           "instituteName",
//   //           "instituteType",
//   //           "quota",
//   //           "category",
//   //           "course",
//   //         ]
//   //         if (cleanData.subQuota) conflictKeys.push("subQuota")
//   //         if (cleanData.subCategory) conflictKeys.push("subCategory")

//   //         // Upsert row (insert or update on conflict)
//   // const conflictKeyString = conflictKeys.join(",")
// const conflictKeys = [
//   "instituteName",
//   "instituteType",
//   "quota",
//   "category",
//   "course",
//   "subQuota",
//   "subCategory",
// ];
// const { error } =await supabase
//   .from(tableName)
//   .upsert(normalizedData, { onConflict: conflictKeys });

//           if (error) throw error

//           // Supabase upsert doesn't directly tell insert or update,
//           // so count all as inserted for simplicity or you can query later for details.
//           inserted++
//           const msg = `${logPrefix} - 🆕 UPSERTED: ${JSON.stringify(conflictKeys)}`
//           logs.push(msg)
//           insertedRows.push({ index: recordNum, row, conflictKeys })
//           console.log(msg)
//         } catch (error) {
//           failed++
//           const errorMsg =
//             error instanceof Error
//               ? error.message
//               : typeof error === "object" && error !== null
//               ? JSON.stringify(error)
//               : String(error)

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

//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         updated, // We don't differentiate here, so this stays 0
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       }

//       allBatchStats.push(batchStats)
//       console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
//       console.log(`🆕 Upserted: ${inserted}`)
//       console.log(`❌ Failed: ${failed}`)
//       console.log(`📋 Total in Batch: ${batchRows.length}`)
//     }

//     // Final summary
//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0)
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0)
//     const allLogs = allBatchStats.flatMap((b) => b.logs)

//     console.log("\n📊 Final Summary:")
//     console.log(`🆕 Upserted: ${totalInserted}`)
//     console.log(`❌ Failed: ${totalFailed}`)
//     console.log(`📋 Total Processed: ${dedupedRows.length}`)

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
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



