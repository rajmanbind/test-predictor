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
  invalidBeforeInsert?: any[]
  skippedDueToDuplicate?: any[]
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

function cleanValue(value: any) {
  if (value === "") return null
  if (typeof value === "string" && !isNaN(Number(value))) return Number(value)
  return value
}

// Build the correct unique key for each row
function getConflictKey(row: CollegeRow): Record<string, any> {
  const base = {
    instituteName: row.instituteName,
    instituteType: row.instituteType,
    course: row.course,
    quota: row.quota,
    category: row.category,
  }
  if (row.subQuota && row.subCategory) {
    return { ...base, subQuota: row.subQuota, subCategory: row.subCategory }
  }
  if (row.subQuota) {
    return { ...base, subQuota: row.subQuota }
  }
  if (row.subCategory) {
    return { ...base, subCategory: row.subCategory }
  }
  return base
}

const BATCH_SIZE = 100
// const BATCH_SIZE = 500;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, counsellingType, stateCode } = body as {
      data: CollegeRow[]
      counsellingType: string | number
      stateCode?: string | null
    }
    console.log("Recieved data: ", data.length)
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
      console.log("Table Name: ", tableName)
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
    // const skippedDueToDuplicate: CollegeRow[] = [];
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

    for (let i = 0; i < data.length; i++) {
      const row = data[i]

      // Check required fields early
      const missingFields = requiredFields.filter((field) => !row[field])
      if (missingFields.length > 0) {
        invalidRowsBeforeInsert.push({
          index: i + 1,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
          row,
        })
        continue
      }
      const key = JSON.stringify(getConflictKey(row))
      if (!seen.has(key)) {
        seen.add(key)
        dedupedRows.push(row)
        firstOccurrences.set(key, { index: i + 1, row }) // Save first appearance
      } else {
        // This is the missing row you're chasing
        // skippedDueToDuplicate.push(row);
        // console.warn(`⚠️ Skipped duplicate at index ${i + 1}:`, row);
        const original = firstOccurrences.get(key)
        // skippedDueToDuplicate.push({
        //   index: i + 1,
        //   row,
        //   duplicateOf: original!
        // });
        skippedDueToDuplicate.push({
          index: i + 1,
          row: row,
          duplicateOf: {
            index: original!.index,
            row: original!.row,
          },
        })

        console.warn(
          `⚠️ Skipped duplicate at index ${i + 1}:\nDuplicate Row:`,
          row,
          `\n↪️ Duplicate of index ${original!.index}:\nOriginal Row:`,
          original!.row,
        )
      }
    }

    // Batch processing
    const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE)
    const allBatchStats: BatchStats[] = []

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
          const requiredFields = [
            "instituteName",
            "instituteType",
            "course",
            "quota",
            "category",
          ]
          const missingFields = requiredFields.filter((field) => !row[field])

          if (missingFields.length > 0) {
            throw new Error(
              `Missing required fields: ${missingFields.join(", ")}`,
            )
          }

          const conflictKey = getConflictKey(row)

          const cleanData: CollegeRow = Object.fromEntries(
            Object.entries(row)
              .filter(([key]) => key !== "id") // Remove id
              .map(([key, value]) => [key, cleanValue(value)]),
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

            const msg = `${logPrefix} - ✅  ✅  Updated: InstituteName ${row.instituteName} InstituteType ${row.instituteName} Course ${row.course} Quota ${row.quota} Category ${row.category} Sub-Quota ${row.subQuota} Sub-Category ${row.subCategory}`
            updated++
            logs.push(msg)
            console.log(msg)
          } else {
            // Insert
            const { error } = await supabase.from(tableName).insert(cleanData)

            if (error) throw error

            const msg = `${logPrefix} -  ✅ 🆕 ✅ Inserted: InstituteName ${row.instituteName} InstituteType ${row.instituteName} Course ${row.course} Quota ${row.quota} Category ${row.category} Sub-Quota ${row.subQuota} Sub-Category ${row.subCategory}`
            inserted++
            logs.push(msg)
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

      // Terminal log for batch
      console.log(`\n📦 Batch ${batchNum + 1} Summary:`)
      console.log(`🆕 Inserted: ${inserted}`)
      console.log(`🔄 Updated: ${updated}`)
      console.log(`❌ Failed: ${failed}`)
      console.log(`📋 Total in Batch: ${batchRows.length}`)
      //   await new Promise(res => setTimeout(res, 0));
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

    console.log("skipped: ", skippedDueToDuplicate)
    const allLogs = allBatchStats.flatMap((b) => b.logs)
    return NextResponse.json({
      success: totalFailed === 0,

      inserted: totalInserted,
      updated: totalUpdated,
      failed: totalFailed,
      total: dedupedRows.length,
      logs: allLogs,
      batchStats: allBatchStats,
      skippedDueToDuplicate,
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

// import { createAdminSupabaseClient } from "@/lib/supabase";
// import { NextRequest, NextResponse } from "next/server";

// type CollegeRow = {
//   instituteName: string;
//   instituteType: string;
//   course: string;
//   quota: string;
//   category: string;
//   subQuota?: string | null;
//   subCategory?: string | null;
//   [key: string]: any;
// };

// type BatchStats = {
//   batchNum: number;
//   inserted: number;
//   failed: number;
//   total: number;
//   logs: string[];
//   errors: { record: number; error: string; data: CollegeRow }[];
// };

// function getTableName(counsellingType: string | number, stateCode?: string | null): string {
//   const isAllIndia =
//     counsellingType === "All India Counselling" ||
//     counsellingType === 1 ||
//     counsellingType === "1";
//   if (
//     isAllIndia &&
//     (!stateCode || stateCode === "null" || stateCode === "undefined" || stateCode === "")
//   ) {
//     return "college_table_all_india";
//   }
//   if (
//     stateCode &&
//     stateCode !== "null" &&
//     stateCode !== "undefined" &&
//     stateCode !== ""
//   ) {
//     return `college_table_${stateCode}`;
//   }
//   throw new Error("Table name cannot be determined (invalid counsellingType/stateCode).");
// }

// function cleanValue(value: any) {
//   if (value === "") return null;
//   if (typeof value === "string" && !isNaN(Number(value))) return Number(value);
//   return value;
// }

// function getConflictKeyFields(): string[] {
//   return [
//     "instituteName",
//     "instituteType",
//     "course",
//     "quota",
//     "category",
//     "subQuota",
//     "subCategory"
//   ];
// }

// function getConflictKeyString(row: CollegeRow): string {
//   const key: Record<string, any> = {};
//   for (const field of getConflictKeyFields()) {
//     key[field] = row[field] ?? null;
//   }
//   return JSON.stringify(key);
// }

// const BATCH_SIZE = 500;

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { data, counsellingType, stateCode } = body as {
//       data: CollegeRow[];
//       counsellingType: string | number;
//       stateCode?: string | null;
//     };

//     if (!data?.length) {
//       return NextResponse.json({ error: "No data provided" }, { status: 400 });
//     }
//     if (!counsellingType) {
//       return NextResponse.json({ error: "Missing counsellingType" }, { status: 400 });
//     }

//     let tableName: string;
//     try {
//       tableName = getTableName(counsellingType, stateCode);
//       console.log("Table Name:", tableName);
//     } catch (err) {
//       return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
//     }

//     const supabase = createAdminSupabaseClient();

//     // Deduplicate
//     const seen = new Set<string>();
//     const dedupedRows: CollegeRow[] = [];
//     for (const row of data) {
//       const key = getConflictKeyString(row);
//       if (!seen.has(key)) {
//         seen.add(key);
//         dedupedRows.push(row);
//       }
//     }

//     const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE);
//     const allBatchStats: BatchStats[] = [];

//     for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
//       const startIdx = batchNum * BATCH_SIZE;
//       const endIdx = Math.min(startIdx + BATCH_SIZE, dedupedRows.length);
//       const batchRows = dedupedRows.slice(startIdx, endIdx);

//       const cleanedBatch = batchRows.map((row, i) => {
//         const cleanData: CollegeRow = Object.fromEntries(
//           Object.entries(row)
//             .filter(([key]) => key !== "id")
//             .map(([key, value]) => [key, cleanValue(value)])
//         ) as CollegeRow;
//         return cleanData;
//       });

//       let inserted = 0;
//       let failed = 0;
//       const logs: string[] = [];
//       const errors: { record: number; error: string; data: CollegeRow }[] = [];

//       const { data: result, error } = await supabase
//         .from(tableName)
//         .upsert(cleanedBatch, {
//           onConflict: getConflictKeyFields(),
//         });

//       if (error) {
//         failed = cleanedBatch.length;
//         logs.push(`❌ Batch ${batchNum + 1} failed: ${error.message}`);
//         errors.push(
//           ...cleanedBatch.map((row, i) => ({
//             record: startIdx + i + 1,
//             error: error.message,
//             data: row
//           }))
//         );
//       } else {
//         inserted = cleanedBatch.length;
//         logs.push(`✅ Batch ${batchNum + 1} upserted ${inserted} records.`);
//       }

//       const batchStats: BatchStats = {
//         batchNum: batchNum + 1,
//         inserted,
//         failed,
//         total: batchRows.length,
//         logs,
//         errors,
//       };

//       allBatchStats.push(batchStats);
//       console.log(`📦 Batch ${batchNum + 1} Summary: Inserted/Updated ${inserted}, Failed ${failed}`);
//     }

//     const totalInserted = allBatchStats.reduce((sum, b) => sum + b.inserted, 0);
//     const totalFailed = allBatchStats.reduce((sum, b) => sum + b.failed, 0);
//     const allLogs = allBatchStats.flatMap(b => b.logs);

//     console.log("\n📊 Final Summary:");
//     console.log(`🆕 Upserted: ${totalInserted}`);
//     console.log(`❌ Failed: ${totalFailed}`);
//     console.log(`📋 Total Processed: ${dedupedRows.length}`);

//     return NextResponse.json({
//       success: totalFailed === 0,
//       inserted: totalInserted,
//       failed: totalFailed,
//       total: dedupedRows.length,
//       logs: allLogs,
//       batchStats: allBatchStats
//     });

//   } catch (err) {
//     console.error("💥 Server-level error:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error",
//         details: err instanceof Error ? err.message : "Unknown error"
//       },
//       { status: 500 }
//     );
//   }
// }

