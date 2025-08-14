// // "use client"

// // import { useEffect, useState } from "react"

// // // import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// // type CounsellingType = {
// //   id?:number;
// //   name?: string;
// //   type?: "all-india" | "state";
// // }

// // type State = {
// //   id?:number;
// //   code?: string
// //   name?: string
// // }

// // // const counsellingList: CounsellingType[] = [
// // //   { id: 1, name: "All India Counselling", type: "all-india" },
// // //   { id: 2, name: "State Counselling", type: "state" },
// // // ]

// // export default function SeatManagement() {
// //   const [selectedCounselling, setSelectedCounselling] = useState<CounsellingType | null>(null);
// //   const [counsellingTypeList, setCounsellingTypeList] = useState<CounsellingType[]>([]);
// //   const [selectedState, setSelectedState] = useState<State | null>(null);
// //   const [stateList, setStateList] = useState<State[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [message, setMessage] = useState("");
// //   async function fetchStates() {
// //     try {
// //       const res = await fetch("/api/states")
// //       const json = await res.json()
// //       return json.data
// //     } catch (error) {
// //       throw error
// //     }
// //   }
// //   async function fetchCounsellingTypes() {
// //     try {
// //       const res = await fetch("/api/counselling-types")
// //       const json = await res.json()
// //       return json.data
// //     } catch (error) {
// //       throw error
// //     }
// //   }
// //   // Fetch state list from Supabase

// //   useEffect(() => {
// //     const getStates = async () => {
// //       try {
// //         const data = await fetchStates()
// //         console.log("State Data: ", data)
// //         setStateList(data)
// //       } catch (error) {
// //         console.error("Failed to load States:", error)
// //       }
// //     }

// //     getStates()
// //   }, [])
// //   useEffect(() => {
// //     const loadCounsellingTypes = async () => {
// //       try {
// //         const data = await fetchCounsellingTypes()
// //         console.log("Counselling Data: ", data)
// //         setCounsellingTypeList(data)
// //       } catch (error) {
// //         console.error("Failed to load counselling types:", error)
// //       }
// //     }

// //     loadCounsellingTypes()
// //   }, [])



// // const handleFetchAndInsert = async () => {
// //   console.log("Starting data import");
// //   if (!selectedCounselling) {
// //     setMessage('Please select a counselling Type.');
// //     return;
// //   }
// //   if (selectedCounselling.id === 2 && !selectedState) {
// //     setMessage('Please select a state.');
// //     return;
// //   }

// //   setIsLoading(true);
// //   setMessage('');

// //   try {
// //     const stateCode = selectedState?.code??null;
// //     const res = await fetch(`/api/college-tables?stateCode=${stateCode}`);
// //     const { data: collegeData, error } = await res.json();

// //     if (error) throw error;
// //     console.log("College Data: ",stateCode?stateCode:"All India", collegeData.length);

// //     const uniqueQuotaMap = new Map<string, number>();
// //     const subQuotaMap = new Map<string, number>();
// //     const categoryMap = new Map<string, { id: number; quotaId: number }>();
// //     const subCategoryMap = new Map<string, { id: number; categoryId: number }>();

// //     // 1. Quotas
// //     for (const row of collegeData || []) {
// //       const quotaName = row.quota?.trim();
// //       if (quotaName && !uniqueQuotaMap.has(quotaName)) {
// //         try {
// //           const res = await fetch("/api/admin/add-quota", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               name: quotaName,
// //               counselling_type_id: selectedCounselling.id || null,
// //               state_code: selectedCounselling.id === 2 ? selectedState?.code : null,
// //               is_common: false,
// //             }),
// //           });

// //           const result = await res.json();
// //           if (result?.data?.id) {
// //             uniqueQuotaMap.set(quotaName, result.data.id);
// //           } else if (result?.msg === "Quota already exists" && result?.id) {
// //             uniqueQuotaMap.set(quotaName, result.id);
// //           } else {
// //             console.warn("Quota insert warning:", result?.msg || result?.error);
// //           }
// //         } catch (error) {
// //           console.error("Quota insert error:", error);
// //         }
// //       }
// //     }

// //     // 2. Sub-Quotas
// //     for (const row of collegeData || []) {
// //       const subQuotaName = row.subQuota?.trim();
// //       const quotaName = row.quota?.trim();
// //       if (!subQuotaName || !quotaName) continue;

// //       const quotaId = uniqueQuotaMap.get(quotaName);
// //       if (!quotaId) continue;

// //       const compositeKey = `${subQuotaName}-${quotaId}`;
// //       if (!subQuotaMap.has(compositeKey)) {
// //         try {
// //           const res = await fetch("/api/admin/add-sub-quota", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               name: subQuotaName,
// //               quota_type_id: quotaId,
// //             }),
// //           });

// //           const result = await res.json();
// //           if (result?.data?.id) {
// //             subQuotaMap.set(compositeKey, result.data.id);
// //           } else if (result?.msg === "Sub-quota already exists" && result?.id) {
// //             subQuotaMap.set(compositeKey, result.id);
// //           } else {
// //             console.warn("Sub-Quota insert warning:", result?.msg || result?.error);
// //           }
// //         } catch (error) {
// //           console.error("Sub-Quota insert error:", error);
// //         }
// //       }
// //     }

// //     // 3. Categories
// //     for (const row of collegeData || []) {
// //       const categoryName = row.category?.trim();
// //       const quotaName = row.quota?.trim();
// //       if (!categoryName || !quotaName) continue;

// //       const quotaId = uniqueQuotaMap.get(quotaName);
// //       if (!quotaId) continue;

// //       const compositeKey = `${categoryName}-${quotaId}`;
// //       if (!categoryMap.has(compositeKey)) {
// //         try {
// //           const res = await fetch("/api/admin/add-category", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               name: categoryName,
// //               quota_type_id: quotaId,
// //             }),
// //           });

// //           const result = await res.json();
// //           if (result?.data?.id) {
// //             categoryMap.set(compositeKey, { id: result.data.id, quotaId });
// //           } else if (result?.msg === "Category already exists" && result?.id) {
// //             categoryMap.set(compositeKey, { id: result.id, quotaId });
// //           } else {
// //             console.warn("Category insert warning:", result?.msg || result?.error);
// //           }
// //         } catch (error) {
// //           console.error("Category insert error:", error);
// //         }
// //       }
// //     }

// //     // 4. Sub-Categories
// //     for (const row of collegeData || []) {
// //       const subCategoryName = row.subCategory?.trim();
// //       const categoryName = row.category?.trim();
// //       const quotaName = row.quota?.trim();
// //       if (!subCategoryName || !categoryName || !quotaName) continue;

// //       const quotaId = uniqueQuotaMap.get(quotaName);
// //       if (!quotaId) continue;

// //       const categoryKey = `${categoryName}-${quotaId}`;
// //       const categoryInfo = categoryMap.get(categoryKey);
// //       if (!categoryInfo) continue;

// //       const compositeKey = `${subCategoryName}-${categoryInfo.id}`;
// //       if (!subCategoryMap.has(compositeKey)) {
// //         try {
// //           const res = await fetch("/api/admin/add-sub-category", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //               name: subCategoryName,
// //               category_id: categoryInfo.id,
// //             }),
// //           });

// //           const result = await res.json();
// //           if (result?.data?.id) {
// //             subCategoryMap.set(compositeKey, {
// //               id: result.data.id,
// //               categoryId: categoryInfo.id,
// //             });
// //           } else if (result?.msg === "Sub-category already exists" && result?.id) {
// //             subCategoryMap.set(compositeKey, {
// //               id: result.id,
// //               categoryId: categoryInfo.id,
// //             });
// //           } else {
// //             console.warn("Sub-Category insert warning:", result?.msg || result?.error);
// //           }
// //         } catch (error) {
// //           console.error("Sub-Category insert error:", error);
// //         }
// //       }
// //     }

// //     setMessage("All data imported successfully!");
// //   } catch (error) {
// //     console.error(error);
// //     setMessage("Error during data import. Check console for details.");
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// //   return (
// //     <div className="max-w-xl mx-auto p-6">
// //       <h1 className="text-xl font-bold mb-4">Seat Import Manager</h1>

    

// // {/* Selection Controls */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //         <div>
// //           <label className="block text-sm font-medium mb-1">Counselling Type</label>
// //           <select
// //             value={selectedCounselling?.id || ''}
// //             onChange={(e) => {
// //               const selected = counsellingTypeList.find(c => c.id === Number(e.target.value));
// //               setSelectedCounselling(selected || null);
// //               setSelectedState(null);
// //             }}
// //             className="w-full p-2 border rounded"
// //             disabled={isLoading}
// //           >
// //             <option value="">Select Counselling Type</option>
// //             {counsellingTypeList.map((c) => (
// //               <option key={c.id} value={c.id}>{c.name}</option>
// //             ))}
// //           </select>
// //         </div>

// //         {selectedCounselling?.id === 2 && (
// //           <div>
// //             <label className="block text-sm font-medium mb-1">State</label>
// //             <select
// //               value={selectedState?.code}
// //               onChange={(e) => {
                
// //                     const selected = stateList.find(c => c.code ===e.target.value);
                
// //                 setSelectedState(selected||null)}}
// //               className="w-full p-2 border rounded"
// //               disabled={isLoading}
// //             >
// //               <option value="">Select State</option>
// //               {stateList.map(state => (
// //                 <option key={state?.code} value={state?.code}>
// //                   {state.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         )}
// //       </div>

// //       <button
// //         onClick={handleFetchAndInsert}
// //         className="px-4 py-2 bg-green-600 text-white rounded"
// //         disabled={
// //           !selectedCounselling ||
// //           (selectedCounselling.type === "state" && !selectedState) ||
// //           isLoading
// //         }
// //       >
// //         {isLoading ? "Processing..." : "Import Data"}
// //       </button>

// //       {message && (
// //         <div className="mt-4 p-3 text-sm rounded bg-gray-100 text-gray-800">
// //           {message}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// "use client"

// import { useEffect, useState } from "react"

// type CounsellingType = {
//   id?: number
//   text?: string
//   type?: "all-india" | "state"
// }

// type State = {
//   id?: number
//   code?: string
//   text?: string
// }

// export default function SeatManagement() {
//   const [selectedCounselling, setSelectedCounselling] = useState<CounsellingType | null>(null)
//   const [counsellingTypeList, setCounsellingTypeList] = useState<CounsellingType[]>([])
//   const [selectedState, setSelectedState] = useState<State | null>(null)
//   const [stateList, setStateList] = useState<State[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [logs, setLogs] = useState<string[]>([])

//   const addLog = (line: string) => {
//     setLogs(prev => [...prev, line])
//   }

//   const fetchStates = async () => {
//     const res = await fetch("/api/states")
//     const json = await res.json()
//     return json.data
//   }

//   const fetchCounsellingTypes = async () => {
//     const res = await fetch("/api/counselling-types")
//     const json = await res.json()
//     return json.data
//   }

//   useEffect(() => {
//     fetchStates()
//       .then(setStateList)
//       .catch(err => console.error("State load error:", err))
//   }, [])

//   useEffect(() => {
//     fetchCounsellingTypes()
//       .then(setCounsellingTypeList)
//       .catch(err => console.error("Counselling load error:", err))
//   }, [])

//   const handleFetchAndInsert = async () => {
//     setLogs([])
//     console.log("Starting data import")
//     if (!selectedCounselling) {
//       setMessage("Please select a counselling Type.")
//       return
//     }
//     if (selectedCounselling.id === 2 && !selectedState) {
//       setMessage("Please select a state.")
//       return
//     }

//     setIsLoading(true)
//     setMessage("")
// console.log("COlege: ","collegeData")
//     try {
//       const stateCode = selectedState?.code ?? null
//       const ress = await fetch(`/api/college-tables?stateCode=${stateCode}`)
//       const { data: collegeData, error } = await ress.json()
// console.log("COlege: ",collegeData)
//       if (error) throw error
//       addLog(`📥 Fetched ${collegeData.length} records for ${stateCode || "All India"}`)

//       // const uniqueQuotaMap = new Map<string, number>()
//       // const subQuotaMap = new Map<string, number>()
//       // const categoryMap = new Map<string, { id: number; quotaId: number }>()
//       // const subCategoryMap = new Map<string, { id: number; categoryId: number }>()

//       // // Quotas
//       // for (const row of collegeData || []) {
//       //   const quotaName = row.quota?.trim()
//       //   if (quotaName && !uniqueQuotaMap.has(quotaName)) {
//       //     try {
//       //       const res = await fetch("/api/admin/add-quota", {
//       //         method: "POST",
//       //         headers: { "Content-Type": "application/json" },
//       //         body: JSON.stringify({
//       //           name: quotaName,
//       //           courseType:row.courseType,
//       //           counselling_type_id: selectedCounselling.id || null,
//       //           state_code: selectedCounselling.id === 2 ? selectedState?.code : null,
//       //           is_common: false,
//       //         }),
//       //       })
//       //       const result = await res.json()
//       //       if (result?.data?.id) {
//       //         uniqueQuotaMap.set(quotaName, result.data.id)
//       //         addLog(`✅ Quota inserted: ${quotaName}`)
//       //       } else if (result?.msg === "Quota already exists" && result?.id) {
//       //         uniqueQuotaMap.set(quotaName, result.id)
//       //         addLog(`⚠️ Quota exists: ${quotaName}`)
//       //       } else {
//       //         addLog(`❌ Quota error: ${quotaName} - ${result?.msg || result?.error?.message}`)
//       //       }
//       //     } catch (error) {
//       //       addLog(`❌ Quota insert failed: ${quotaName} - ${error}`)
//       //     }
//       //   }
//       // }

//       // // Sub-Quotas
//       // for (const row of collegeData || []) {
//       //   const subQuotaName = row.subQuota?.trim()
//       //   const quotaName = row.quota?.trim()
//       //   if (!subQuotaName || !quotaName) continue

//       //   const quotaId = uniqueQuotaMap.get(quotaName)
//       //   if (!quotaId) continue

//       //   const key = `${subQuotaName}-${quotaId}`
//       //   if (!subQuotaMap.has(key)) {
//       //     try {
//       //       const res = await fetch("/api/admin/add-sub-quota", {
//       //         method: "POST",
//       //         headers: { "Content-Type": "application/json" },
//       //         body: JSON.stringify({ name: subQuotaName, quota_type_id: quotaId }),
//       //       })
//       //       const result = await res.json()
//       //       if (result?.data?.id) {
//       //         subQuotaMap.set(key, result.data.id)
//       //         addLog(`✅ Sub-Quota inserted: ${subQuotaName}`)
//       //       } else if (result?.msg === "Sub-quota already exists" && result?.id) {
//       //         subQuotaMap.set(key, result.id)
//       //         addLog(`⚠️ Sub-Quota exists: ${subQuotaName}`)
//       //       } else {
//       //         addLog(`❌ Sub-Quota error: ${subQuotaName} - ${result?.msg || result?.error?.message}`)
//       //       }
//       //     } catch (error) {
//       //       addLog(`❌ Sub-Quota insert failed: ${subQuotaName} - ${error}`)
//       //     }
//       //   }
//       // }

//       // // Categories
//       // for (const row of collegeData || []) {
//       //   const categoryName = row.category?.trim()
//       //   const quotaName = row.quota?.trim()
//       //   if (!categoryName || !quotaName) continue

//       //   const quotaId = uniqueQuotaMap.get(quotaName)
//       //   if (!quotaId) continue

//       //   const key = `${categoryName}-${quotaId}`
//       //   if (!categoryMap.has(key)) {
//       //     try {
//       //       const res = await fetch("/api/admin/add-category", {
//       //         method: "POST",
//       //         headers: { "Content-Type": "application/json" },
//       //         body: JSON.stringify({ name: categoryName, quota_type_id: quotaId }),
//       //       })
//       //       const result = await res.json()
//       //       if (result?.data?.id) {
//       //         categoryMap.set(key, { id: result.data.id, quotaId })
//       //         addLog(`✅ Category inserted: ${categoryName}`)
//       //       } else if (result?.msg === "Category already exists" && result?.id) {
//       //         categoryMap.set(key, { id: result.id, quotaId })
//       //         addLog(`⚠️ Category exists: ${categoryName}`)
//       //       } else {
//       //         addLog(`❌ Category error: ${categoryName} - ${result?.msg || result?.error?.message}`)
//       //       }
//       //     } catch (error) {
//       //       addLog(`❌ Category insert failed: ${categoryName} - ${error}`)
//       //     }
//       //   }
//       // }

//       // // Sub-Categories
//       // for (const row of collegeData || []) {
//       //   const subCategoryName = row.subCategory?.trim()
//       //   const categoryName = row.category?.trim()
//       //   const quotaName = row.quota?.trim()
//       //   if (!subCategoryName || !categoryName || !quotaName) continue

//       //   const quotaId = uniqueQuotaMap.get(quotaName)
//       //   if (!quotaId) continue

//       //   const categoryKey = `${categoryName}-${quotaId}`
//       //   const categoryInfo = categoryMap.get(categoryKey)
//       //   if (!categoryInfo) continue

//       //   const key = `${subCategoryName}-${categoryInfo.id}`
//       //   if (!subCategoryMap.has(key)) {
//       //     try {
//       //       const res = await fetch("/api/admin/add-sub-category", {
//       //         method: "POST",
//       //         headers: { "Content-Type": "application/json" },
//       //         body: JSON.stringify({ name: subCategoryName, category_id: categoryInfo.id }),
//       //       })
//       //       const result = await res.json()
//       //       if (result?.data?.id) {
//       //         subCategoryMap.set(key, { id: result.data.id, categoryId: categoryInfo.id })
//       //         addLog(`✅ Sub-Category inserted: ${subCategoryName}`)
//       //       } else if (result?.msg === "Sub-category already exists" && result?.id) {
//       //         subCategoryMap.set(key, { id: result.id, categoryId: categoryInfo.id })
//       //         addLog(`⚠️ Sub-Category exists: ${subCategoryName}`)
//       //       } else {
//       //         addLog(`❌ Sub-Category error: ${subCategoryName} - ${result?.msg || result?.error?.message}`)
//       //       }
//       //     } catch (error) {
//       //       addLog(`❌ Sub-Category insert failed: ${subCategoryName} - ${error}`)
//       //     }
//       //   }
//       // }
// const uniqueQuotas = new Map(); // key: `${quotaName}|${courseType}`
// const uniqueSubQuotas = new Map(); // key: `${subQuota}|${quota}|${courseType}`
// const uniqueCategories = new Map(); // key: `${category}|${quota}|${courseType}`
// const uniqueSubCategories = new Map(); // key: `${subCategory}|${category}|${quota}|${courseType}`
// console.log("College Datsa: ",collegeData)
// for (const row of collegeData || []) {

//   console.log(row.quota,row.courseType,row.quota && row.courseType)
//   if (row.quota && row.courseType) {
//     const key = `${row.quota.trim()}|${row.courseType.trim()}`;
//     if (!uniqueQuotas.has(key)) {
//       uniqueQuotas.set(key, {
//         text: row.quota.trim(),
//         courseType: row.courseType.trim(),
//       });
//     }
//   }
//   if (row.subQuota && row.quota && row.courseType) {
//     const key = `${row.subQuota.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//     if (!uniqueSubQuotas.has(key)) {
//       uniqueSubQuotas.set(key, {
//         text: row.subQuota.trim(),
//         quotaName: row.quota.trim(),
//         courseType: row.courseType.trim(),
//       });
//     }
//   }
//   if (row.category && row.quota && row.courseType) {
//     const key = `${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//     if (!uniqueCategories.has(key)) {
//       uniqueCategories.set(key, {
//         text: row.category.trim(),
//         quotaName: row.quota.trim(),
//         courseType: row.courseType.trim(),
//       });
//     }
//   }
//   if (row.subCategory && row.category && row.quota && row.courseType) {
//     const key = `${row.subCategory.trim()}|${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//     if (!uniqueSubCategories.has(key)) {
//       uniqueSubCategories.set(key, {
//         text: row.subCategory.trim(),
//         categoryName: row.category.trim(),
//         quotaName: row.quota.trim(),
//         courseType: row.courseType.trim(),
//       });
//     }
//   }
// }




// const res = await fetch("/api/admin/bulk-insert-metadata", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     quotas: Array.from(uniqueQuotas.values()),
//     subQuotas: Array.from(uniqueSubQuotas.values()),
//     categories: Array.from(uniqueCategories.values()),
//     subCategories: Array.from(uniqueSubCategories.values()),
//     counsellingTypeId: selectedCounselling.id,
//     stateCode: selectedCounselling.id === 2 ? selectedState?.code : null,
//   }),
// });
// const result = await res.json();
// console.log("Res Data: ", result);
//       setMessage("All data imported successfully!")
//     } catch (error) {
//       console.error(error)
//       setMessage("Error during data import. Check logs below.")
//       addLog("🚨 Unexpected error during import: " + error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   console.log(selectedCounselling)
//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-xl font-bold mb-4">Seat Import Manager</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium mb-1">Counselling Type</label>
//           <select
//             value={selectedCounselling?.id || ""}
//             onChange={(e) => {
//               const selected = counsellingTypeList.find(c => c.id === Number(e.target.value))
//               setSelectedCounselling(selected || null)
//               setSelectedState(null)
//             }}
//             className="w-full p-2 border rounded"
//             disabled={isLoading}
//           >
//             <option value="">Select Counselling Type</option>
//             {counsellingTypeList.map((c) => (
//               <option key={c.id} value={c.id}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {selectedCounselling?.id === 2 && (
//           <div>
//             <label className="block text-sm font-medium mb-1">State</label>
//             <select
//               value={selectedState?.code || ""}
//               onChange={(e) => {
//                 const selected = stateList.find(s => s.code === e.target.value)
//                 setSelectedState(selected || null)
//               }}
//               className="w-full p-2 border rounded"
//               disabled={isLoading}
//             >
//               <option value="">Select State</option>
//               {stateList.map(state => (
//                 <option key={state?.code} value={state?.code}>{state.text}</option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       <button
//         onClick={handleFetchAndInsert}
//         className="px-4 py-2 bg-green-600 text-white rounded"
//         disabled={
//           !selectedCounselling ||
//           (selectedCounselling.type === "state" && !selectedState) ||
//           isLoading
//         }
//       >
//         {isLoading ? "Processing..." : "Import Data"}
//       </button>

//       {message && (
//         <div className="mt-4 p-3 text-sm rounded bg-gray-100 text-gray-800">
//           {message}
//         </div>
//       )}

//       {logs.length > 0 && (
//         <div className="mt-6">
//           <h2 className="font-semibold mb-2">Logs:</h2>
//           <div className="bg-gray-100 p-3 rounded max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
//             {logs.map((log, idx) => (
//               <div key={idx} className="mb-1">{log}</div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



// "use client"

// import { Button } from "@/components/common/Button"
// import { useEffect, useState } from "react"

// type CounsellingType = {
//   id?: number
//   text?: string
//   type?: "all-india" | "state"
// }

// type State = {
//   id?: number
//   code?: string
//   text?: string
// }

// export default function SeatManagement() {
//   const [selectedCounselling, setSelectedCounselling] = useState<CounsellingType | null>(null)
//   const [counsellingTypeList, setCounsellingTypeList] = useState<CounsellingType[]>([])
//   const [selectedState, setSelectedState] = useState<State | null>(null)
//   const [stateList, setStateList] = useState<State[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [logs, setLogs] = useState<string[]>([])
//   const [details, setDetails] = useState<any>(null)

//   const addLog = (line: string) => {
//     setLogs(prev => [...prev, line])
//   }

//   const fetchStates = async () => {
//     const res = await fetch("/api/states")
//     const json = await res.json()
//     return json.data
//   }

//   const fetchCounsellingTypes = async () => {
//     const res = await fetch("/api/counselling-types")
//     const json = await res.json()
//     return json.data
//   }

//   useEffect(() => {
//     fetchStates()
//       .then(setStateList)
//       .catch(err => console.error("State load error:", err))
//   }, [])

//   useEffect(() => {
//     fetchCounsellingTypes()
//       .then(setCounsellingTypeList)
//       .catch(err => console.error("Counselling load error:", err))
//   }, [])

//   const handleFetchAndInsert = async () => {
//     setLogs([])
//     setDetails(null)
//     setMessage("")
//     if (!selectedCounselling) {
//       setMessage("Please select a counselling Type.")
//       return
//     }
//     if (selectedCounselling.id === 2 && !selectedState) {
//       setMessage("Please select a state.")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const stateCode = selectedState?.code ?? null
//       const ress = await fetch(`/api/college-tables?stateCode=${stateCode}`)
//       const { data: collegeData, error } = await ress.json()
//       if (error) throw error
//       addLog(`📥 Fetched ${collegeData.length} records for ${stateCode || "All India"}`)

//       // Build unique sets/maps for quotas, subQuotas, categories, subCategories
//       const uniqueQuotas = new Map();
//       const uniqueSubQuotas = new Map();
//       const uniqueCategories = new Map();
//       const uniqueSubCategories = new Map();
// console.log("COllege data: ",collegeData)
// let count = 1;
//       for (const row of collegeData || []) {
//         if (row.quota && row.courseType) {
//           const key = `${row.quota.trim()}|${row.courseType.trim()}`;
//           // console.log("KEY1: ",key)
//           if (!uniqueQuotas.has(key)) {
//              console.log("KEY2: ",count++,key)
//             uniqueQuotas.set(key, {
              
//               text: row.quota.trim(),
//               courseType: row.courseType.trim(),
//             });
//           }
//         }
//         if (row.subQuota && row.quota && row.courseType) {
//           const key = `${row.subQuota.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//           if (!uniqueSubQuotas.has(key)) {
//             uniqueSubQuotas.set(key, {
//               text: row.subQuota.trim(),
//               quotaName: row.quota.trim(),
//               courseType: row.courseType.trim(),
//             });
//           }
//         }
//         if (row.category && row.quota && row.courseType) {
//           const key = `${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//           if (!uniqueCategories.has(key)) {
//             uniqueCategories.set(key, {
//               text: row.category.trim(),
//               quotaName: row.quota.trim(),
//               courseType: row.courseType.trim(),
//             });
//           }
//         }
//         if (row.subCategory && row.category && row.quota && row.courseType) {
//           const key = `${row.subCategory.trim()}|${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
//           if (!uniqueSubCategories.has(key)) {
//             uniqueSubCategories.set(key, {
//               text: row.subCategory.trim(),
//               categoryName: row.category.trim(),
//               quotaName: row.quota.trim(),
//               courseType: row.courseType.trim(),
//             });
//           }
//         }
//       }

//       const res = await fetch("/api/admin/bulk-insert-metadata", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           quotas: Array.from(uniqueQuotas.values()),
//           subQuotas: Array.from(uniqueSubQuotas.values()),
//           categories: Array.from(uniqueCategories.values()),
//           subCategories: Array.from(uniqueSubCategories.values()),
//           counsellingTypeId: selectedCounselling.id,
//           stateCode: selectedCounselling.id === 2 ? selectedState?.code : null,
//         }),
//       });
//       const result = await res.json();
//       setDetails(result);
//       setMessage("All data imported successfully!");
//       if (result.logs) setLogs(result.logs);
//     } catch (error) {
//       console.error(error)
//       setMessage("Error during data import. Check logs below.")
//       addLog("🚨 Unexpected error during import: " + error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-xl font-bold mb-4">Seat Import Manager</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium mb-1">Counselling Type</label>
//           <select
//             value={selectedCounselling?.id || ""}
//             onChange={(e) => {
//               const selected = counsellingTypeList.find(c => c.id === Number(e.target.value))
//               setSelectedCounselling(selected || null)
//               setSelectedState(null)
//             }}
//             className="w-full p-2 border rounded"
//             disabled={isLoading}
//           >
//             <option value="">Select Counselling Type</option>
//             {counsellingTypeList.map((c) => (
//               <option key={c.id} value={c.id}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {selectedCounselling?.id === 2 && (
//           <div>
//             <label className="block text-sm font-medium mb-1">State</label>
//             <select
//               value={selectedState?.code || ""}
//               onChange={(e) => {
//                 const selected = stateList.find(s => s.code === e.target.value)
//                 setSelectedState(selected || null)
//               }}
//               className="w-full p-2 border rounded"
//               disabled={isLoading}
//             >
//               <option value="">Select State</option>
//               {stateList.map(state => (
//                 <option key={state?.code} value={state?.code}>{state.text}</option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       <Button
//         onClick={handleFetchAndInsert}
//         className="px-4 py-2 bg-green-600 text-white rounded"
//         disabled={
//           !selectedCounselling ||
//           (selectedCounselling.type === "state" && !selectedState) ||
//           isLoading
//         }
//       >
//         {isLoading ? "Processing..." : "Import Data"}
//       </Button>

//       {message && (
//         <div className="mt-4 p-3 text-sm rounded bg-gray-100 text-gray-800">
//           {message}
//         </div>
//       )}

//       {logs.length > 0 && (
//         <div className="mt-6">
//           <h2 className="font-semibold mb-2">Logs:</h2>
//           <div className="bg-gray-100 p-3 rounded max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
//             {logs.map((log, idx) => (
//               <div key={idx} className="mb-1">{log}</div>
//             ))}
//           </div>
//         </div>
//       )}

//       {details && (
//         <div className="mt-6">
//           <h2 className="font-semibold mb-2">Server Response:</h2>
//           <div className="bg-gray-100 p-3 rounded max-h-96 overflow-x-auto text-xs whitespace-pre-wrap">
//             {JSON.stringify(details, null, 2)}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }






import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import AddQuotaCategorySubQuotaSubCategory from "@/components/admin-panel/add-meta-data/AddQuotaCategory"
import React from "react"

export default function AddDataPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Add Quota Category Sub Quota Sub Category</Heading>

      <AddQuotaCategorySubQuotaSubCategory />
    </BELayout>
  )
}
