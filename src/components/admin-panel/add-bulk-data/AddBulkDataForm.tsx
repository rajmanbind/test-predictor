

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
  const [details, setDetails] = useState<any>(null)

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
            setDetails(null)
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
    setDetails(null)

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
          ...(json.logs || []),
        ])
        setDetails(json)
        showToast("success", "Upload complete")
      } else {
        setLogs(["❌ Upload failed", json.error])
        setDetails(json)
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
          <Button variant="outline" onClick={() => { setFile(null); setParsedData([]); setDetails(null); setLogs([]); }}>Clear</Button>
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

        {/* Details Table */}
        {details && (
          <div className="bg-gray-50 border rounded p-3 mt-4 max-h-96 overflow-x-auto text-xs">
            <div className="mb-2 font-semibold">Server Details:</div>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify({
                inserted: details.inserted,
                updated: details.updated,
                failed: details.failed,
                total: details.total,
                skippedDueToDuplicate: details.skippedDueToDuplicate?.length,
                updatedRows: details.updatedRows?.length,
                insertedRows: details.insertedRows?.length,
                invalidBeforeInsert: details.invalidBeforeInsert?.length,
              }, null, 2)}
            </pre>

            {details.skippedDueToDuplicate?.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-yellow-700">Skipped Duplicates:</div>
                <div className="overflow-x-auto max-h-40">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="border px-1">#</th>
                        <th className="border px-1">Duplicate Row</th>
                        <th className="border px-1">Duplicate Of</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.skippedDueToDuplicate.map((dup: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border px-1">{dup.index} && {dup.duplicateOf.index}</td>
                          <td className="border px-1">{JSON.stringify(dup.row)}</td>
                          <td className="border px-1">{JSON.stringify(dup.duplicateOf.row)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {details.updatedRows?.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-blue-700">Updated Rows:</div>
                <div className="overflow-x-auto max-h-40">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="border px-1">#</th>
                        <th className="border px-1">Row</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.updatedRows.map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border px-1">{row.index}</td>
                          <td className="border px-1">{JSON.stringify(row.row)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {details.insertedRows?.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-green-700">Inserted Rows:</div>
                <div className="overflow-x-auto max-h-40">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="border px-1">#</th>
                        <th className="border px-1">Row</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.insertedRows.map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border px-1">{row.index}</td>
                          <td className="border px-1">{JSON.stringify(row.row)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {details.invalidBeforeInsert?.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold text-red-700">Invalid Rows (Missing Fields):</div>
                <div className="overflow-x-auto max-h-40">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="border px-1">#</th>
                        <th className="border px-1">Reason</th>
                        <th className="border px-1">Row</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.invalidBeforeInsert.map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border px-1">{row.index}</td>
                          <td className="border px-1">{row.reason}</td>
                          <td className="border px-1">{JSON.stringify(row.row)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}