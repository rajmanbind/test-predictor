
// "use client"

// import { useEffect, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import Papa from "papaparse"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { useAppState } from "@/hooks/useAppState"

// type CsvRow = Record<string, string>

// interface State {
//   code: string
//   text: string
// }

// const counsellingTypes = [
//   { id: 1, text: "All India Counselling" },
//   { id: 2, text: "State Counselling" },
// ]

// export default function BulkUploadForm() {
//   const { showToast } = useAppState()
//   const [file, setFile] = useState<File | null>(null)
//   const [parsedData, setParsedData] = useState<CsvRow[]>([])
//   const [logs, setLogs] = useState<string[]>([])
//   const [isUploading, setIsUploading] = useState(false)

//   const [counsellingType, setCounsellingType] = useState<string>("")
//   const [stateCode, setStateCode] = useState<string>("")
//   const [stateList, setStateList] = useState<State[]>([])

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "text/csv": [".csv"] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       const selectedFile = acceptedFiles[0]
//       setFile(selectedFile)
//       if (selectedFile) {
//         Papa.parse<CsvRow>(selectedFile, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setParsedData(results.data)
//             setLogs([`📄 Parsed ${results.data.length} rows`])
//           },
//           error: () => {
//             showToast("error", "Failed to parse CSV")
//           },
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await fetch("/api/states")
//         const json = await res.json()
//         setStateList(json.data || [])
//       } catch {
//         showToast("error", "Failed to fetch states")
//       }
//     }
//     fetchStates()
//   }, [])

//   const handleUpload = async () => {



//     console.log("Counselling: ",counsellingType,stateCode)
//     if (!parsedData.length) return showToast("error", "No data to upload")
//     if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
//       return showToast("error", "Select counselling type and state")
//     }

//     setIsUploading(true)
//     setLogs(["🚀 Uploading..."])

//     try {


// //       if(!counsellingType){
// //         console.log("selecte Counseling Type" , counsellingType,stateCode)
// // return 
// //       }
//       const res = await fetch("/api/admin/add_bulk_data", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 


//      data: parsedData, // <--- just the CSV rows
//         counsellingType,  // <--- top-level
//         stateCode: counsellingType === "State Counselling" ? stateCode : null, // <--- top-level

//          }),
//       })
//       const json = await res.json()

//       if (res.ok) {

//         console.log("dat: ",json)
//         setLogs([
//           `✅ Inserted: ${json.inserted}`,
//           `✅ Updated: ${json.updated}`,
//           `❌ Failed: ${json.failed}`,
//           "📋 Details:",
//           ...json.logs,
//         ])
//         showToast("success", "Upload complete")
//       } else {
//         setLogs(["❌ Upload failed", json.error])
//         showToast("error", json.error || "Upload failed")
//       }
//     } catch (err) {
//       setLogs(["❌ Network error"])
//       showToast("error", "Upload failed")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <div className="p-4">
//       <Card className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

//         {/* Counselling Type */}
//         <div>
//           <label className="block mb-1">Counselling Type</label>
//           <select
//             value={counsellingType}
//             onChange={(e) => {
//               setCounsellingType(e.target.value)
//               setStateCode("")
//             }}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select</option>
//             {counsellingTypes.map(c => (
//               <option key={c.id} value={c.text}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {/* State Dropdown */}
//         {counsellingType === "State Counselling" && (
//           <div>
//             <label className="block mb-1">Select State</label>
//             <select
//               value={stateCode}
//               onChange={(e) => setStateCode(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select State</option>
//               {stateList.map(s => (
//                 <option key={s.code} value={s.code}>{s.text}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Dropzone */}
//         <div {...getRootProps()} className="border-2 border-dashed p-6 text-center rounded cursor-pointer">
//           <input {...getInputProps()} />
//           {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
//         </div>

//         {/* Upload button */}
//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={() => setFile(null)}>Clear</Button>
//           <Button onClick={handleUpload} disabled={isUploading || !file}>
//             {isUploading ? "Uploading..." : "Upload"}
//           </Button>
//         </div>

//         {/* Logs */}
//         {logs.length > 0 && (
//           <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm">
//             {logs.map((log, idx) => (
//               <div
//                 key={idx}
//                 className={
//                   log.startsWith("❌") ? "text-red-600" :
//                   log.startsWith("✅") || log.startsWith("🆕") ? "text-green-600" :
//                   ""
//                 }
//               >
//                 {log}
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { useAppState } from "@/hooks/useAppState"

type CsvRow = Record<string, string>

interface State {
  code: string
  text: string
}

const counsellingTypes = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]

export default function BulkUploadForm() {
  const { showToast } = useAppState()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<CsvRow[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const [counsellingType, setCounsellingType] = useState<string>("")
  const [stateCode, setStateCode] = useState<string>("")
  const [stateList, setStateList] = useState<State[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      if (selectedFile) {
        Papa.parse<CsvRow>(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setParsedData(results.data)
            setLogs([`📄 Parsed ${results.data.length} rows`])
          },
          error: () => {
            showToast("error", "Failed to parse CSV")
          },
        })
      }
    },
  })

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("/api/states")
        const json = await res.json()
        setStateList(json.data || [])
      } catch {
        showToast("error", "Failed to fetch states")
      }
    }
    fetchStates()
  }, [])

  const handleUpload = async () => {
    if (!parsedData.length) return showToast("error", "No data to upload")
    if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
      return showToast("error", "Select counselling type and state")
    }

    setIsUploading(true)
    setLogs(["🚀 Uploading..."])

    try {
      const res = await fetch("/api/admin/add_bulk_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: parsedData,
          counsellingType,
          stateCode: counsellingType === "State Counselling" ? stateCode : null,
        }),
      })

      const json = await res.json()

      if (res.ok) {
        setLogs([
          `✅ Inserted: ${json.inserted}`,
          `✅ Updated: ${json.updated}`,
          `❌ Failed: ${json.failed}`,
          "📋 Details:",
          ...json.logs,
        ])
        showToast("success", "Upload complete")
      } else {
        setLogs(["❌ Upload failed", json.error])
        showToast("error", json.error || "Upload failed")
      }
    } catch (err) {
      setLogs(["❌ Network error"])
      showToast("error", "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-4">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

        {/* Counselling Type */}
        <div>
          <label className="block mb-1">Counselling Type</label>
          <select
            value={counsellingType}
            onChange={(e) => {
              setCounsellingType(e.target.value)
              setStateCode("")
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {counsellingTypes.map(c => (
              <option key={c.id} value={c.text}>{c.text}</option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        {counsellingType === "State Counselling" && (
          <div>
            <label className="block mb-1">Select State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select State</option>
              {stateList.map(s => (
                <option key={s.code} value={s.code}>{s.text}</option>
              ))}
            </select>
          </div>
        )}

        {/* Dropzone with conditional green border */}
        <div
          {...getRootProps()}
          className={`p-6 text-center rounded cursor-pointer transition-all duration-300 border-2 border-dashed ${
            file ? "border-green-500 bg-green-50 text-green-800" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
        </div>

        {/* Upload button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setFile(null)}>Clear</Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith("❌") ? "text-red-600" :
                  log.startsWith("✅") || log.startsWith("🆕") ? "text-green-600" :
                  ""
                }
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
