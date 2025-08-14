
// "use client"

// import { BELayout } from "@/components/admin-panel/BELayout"
// import { Heading } from "@/components/admin-panel/Heading"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { Input } from "@/components/common/Input"
// import SearchAndSelect from "@/components/common/SearchAndSelect"
// import { useAppState } from "@/hooks/useAppState"
// import useFetch from "@/hooks/useFetch"
// import { IOption } from "@/types/GlobalTypes"
// import {
//   autoComplete,
//   cn,
//   isEmpty,
//   onOptionSelected,
//   shouldRenderComponent,
//   clearReactHookFormValueAndStates,
// } from "@/utils/utils"
// import React, { useEffect, useRef, useState } from "react"
// import { useForm } from "react-hook-form"
// import { Tooltip } from "react-tooltip"

// const indianStates = [
//   { name: "Andhra Pradesh", code: "AP" },
//   { name: "Arunachal Pradesh", code: "AR" },
//   { name: "Assam", code: "AS" },
//   { name: "Bihar", code: "BR" },
//   { name: "Chhattisgarh", code: "CG" },
//   { name: "Goa", code: "GA" },
//   { name: "Gujarat", code: "GJ" },
//   { name: "Haryana", code: "HR" },
//   { name: "Himachal Pradesh", code: "HP" },
//   { name: "Jharkhand", code: "JH" },
//   { name: "Karnataka", code: "KA" },
//   { name: "Kerala", code: "KL" },
//   { name: "Madhya Pradesh", code: "MP" },
//   { name: "Maharashtra", code: "MH" },
//   { name: "Manipur", code: "MN" },
//   { name: "Meghalaya", code: "ML" },
//   { name: "Mizoram", code: "MZ" },
//   { name: "Nagaland", code: "NL" },
//   { name: "Odisha", code: "OR" },
//   { name: "Punjab", code: "PB" },
//   { name: "Rajasthan", code: "RJ" },
//   { name: "Sikkim", code: "SK" },
//   { name: "Tamil Nadu", code: "TN" },
//   { name: "Telangana", code: "TS" },
//   { name: "Tripura", code: "TR" },
//   { name: "Uttar Pradesh", code: "UP" },
//   { name: "Uttarakhand", code: "UK" },
//   { name: "West Bengal", code: "WB" },
//   { name: "Andaman and Nicobar Islands", code: "AN" },
//   { name: "Chandigarh", code: "CH" },
//   { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
//   { name: "Delhi", code: "DL" },
//   { name: "Jammu and Kashmir", code: "JK" },
//   { name: "Ladakh", code: "LA" },
//   { name: "Lakshadweep", code: "LD" },
//   { name: "Puducherry", code: "PY" }
// ]

// const dropDownType: IOption[] = [
//   { id: "College Cutoff - UG", text: "W College Cutoff - UG" },
//   { id: "College Cutoff - PG", text: "W College Cutoff - PG" },
//   { id: "College Cutoff - MDS", text: "W College Cutoff - MDS" },
//   { id: "College Cutoff - SS", text: "W College Cutoff - PG" },
//   { id: "College Cutoff - DNB", text: "W College Cutoff - DNB" },
//   { id: "College Cutoff - INICET", text: "W College Cutoff - INICET" },
//   { id: "College Predictor", text: "College Predictor" },
//   { id: "Single College Closing Rank - UG", text: "Single College Closing Rank - UG" },
//   { id: "Single College Closing Rank - PG", text: "Single College Closing Rank - PG" },
//   { id: "Single College Closing Rank - MDS", text: "Single College Closing Rank - MDS" },
//   { id: "Single College Closing Rank - SS", text: "Single College Closing Rank - SS" },
//   { id: "Single College Closing Rank - DNB", text: "Single College Closing Rank - DNB" },
//   { id: "Single College Closing Rank - INICET", text: "Single College Closing Rank - INICET" },
//   { id: "State Closing Rank - UG", text: "State Closing Rank - UG" },
//   { id: "State Closing Rank - PG", text: "State Closing Rank - PG" },
//   { id: "State Closing Rank - MDS", text: "State Closing Rank - MDS" },
//   { id: "All India Closing Rank - UG", text: "All India Closing Rank - UG" },
//   { id: "All India Closing Rank - PG", text: "All India Closing Rank - PG" },
//   { id: "All India Closing Rank - MDS", text: "All India Closing Rank - MDS" },
//   { id: "All India Closing Rank - DNB", text: "All India Closing Rank - DNB" },
//   { id: "All India Closing Rank - INICET", text: "All India Closing Rank - INICET" },
//   { id: "All India Closing Rank - SS", text: "All India Closing Rank - SS" },
//   { id: "Packages", text: "Packages" },
// ]

// export default function ConfigurePricesPage() {
//   const [configList, setConfigList] = useState<any[]>([])
//   const [initialConfigList, setInitialConfigList] = useState<any[]>([])
//   const [selectedType, setSelectedType] = useState<IOption | undefined>()
//   const [bulkPrice, setBulkPrice] = useState<string>("")
//   const [isBulkLoading, setIsBulkLoading] = useState(false)
//   const [editIndex, setEditIndex] = useState<number | null>(null)
//   const [editValue, setEditValue] = useState<string>("")
//   const [addValues, setAddValues] = useState<{ [code: string]: string }>({})

//   const {
//     control,
//     setValue,
//     formState: { errors },
//   } = useForm({ shouldFocusError: true })
//   const { fetchData } = useFetch()
//   const { showToast } = useAppState()
//   const { appState } = useAppState()
//   const listRef = useRef<HTMLUListElement>(null)

//   useEffect(() => {
//     if (selectedType) getData(selectedType.id)
//     setBulkPrice("")
//     setAddValues({})
//   }, [selectedType])

//   async function getData(type: string) {
//     const res = await fetchData({
//       url: "/api/admin/configure_prices/get",
//       params: { type },
//     })
//     if (res?.success) {
//       setConfigList(res?.payload?.data || [])
//       setInitialConfigList(res?.payload?.data || [])
//     }
//   }

//   function updateText(index: number, text: string) {
//     setConfigList((prev) =>
//       prev.map((item, i) => (i === index ? { ...item, price: text } : item)),
//     )
//   }
// async function handleBulkAdd() {
//   if (!bulkPrice || isNaN(Number(bulkPrice))) {
//     showToast("error", "Enter a valid price")
//     return
//   }
//   setIsBulkLoading(true)
//   try {
//     await fetchData({
//       url: "/api/admin/configure_prices/add",
//       method: "POST",
//       data: {
//         price: Number(bulkPrice),
//         type: selectedType?.id,
//         isBulkAdd: true,
//       },
//     })
//     showToast("success", "Bulk prices added for all states")
//     getData(selectedType!.id)
//     setBulkPrice("")
//     setAddValues({})
//   } catch (e) {
//     showToast("error", "Bulk add failed")
//   } finally {
//     setIsBulkLoading(false)
//   }
// }
// async function handleSingleAdd(state: any, price: string) {
//   if (!price || isNaN(Number(price))) {
//     showToast("error", "Enter a valid price")
//     return
//   }
//   await fetchData({
//     url: "/api/admin/configure_prices/add",
//     method: "POST",
//     data: {
//       item: state,
//       price: Number(price),
//       type: selectedType?.id,
//     },
//   })
//   getData(selectedType!.id)
//   setAddValues((prev) => ({ ...prev, [state?.code]: "" }))
// }
// async function handleBulkUpdate() {
//   if (!bulkPrice || isNaN(Number(bulkPrice))) {
//     showToast("error", "Enter a valid price")
//     return
//   }
//   setIsBulkLoading(true)
//   try {
//     await fetchData({
//       url: "/api/admin/configure_prices/update",
//       method: "POST",
//       data: {
//         price: Number(bulkPrice),
//         type: selectedType?.id,
//         isBulkUpdate: true,
//       },
//     })
//     showToast("success", "Bulk prices updated for all states")
//     getData(selectedType!.id)
//     setBulkPrice("")
//   } catch (e) {
//     showToast("error", "Bulk update failed")
//   } finally {
//     setIsBulkLoading(false)
//   }
// }
// async function updateData(id?: string, price: string) {
//   if (!String(price)?.trim()) return
//   const res = await fetchData({
//     url: "/api/admin/configure_prices/update",
//     method: "POST",
//     data: { id, price: Number(price.trim()) },
//   })

//   if (res?.success) {
//     showToast("success", "Updated successfully")
//     getData(selectedType!.id)
//     setEditIndex(null)
//     setEditValue("")
//   }
// }


//   const statesWithPrice = new Set(configList.map((c) => c.item?.code))

//   return (
//     <BELayout className="mb-10 tab:mb-0">
//       <Heading>Configure Prices</Heading>

//       <Card className="mt-4 p-6 min-h-[400px]">
//         <div className="w-full max-w-96">
//           <SearchAndSelect
//             name="dropDownType"
//             label="Select Option"
//             placeholder="Select Option"
//             value={selectedType}
//             onChange={({ name, selectedValue }) => {
//               onOptionSelected(name, selectedValue, () => {})
//               setSelectedType(selectedValue)
//             }}
//             control={control}
//             setValue={setValue}
//             required
//             options={dropDownType}
//             debounceDelay={0}
//             searchAPI={(text, setOptions) =>
//               autoComplete(text, dropDownType, setOptions)
//             }
//             errors={errors}
//           />
//         </div>

//         {shouldRenderComponent([selectedType], "AND") && (
//           <form className="w-full">
//             <div className="text-xl text-color-text mt-8 mb-4">
//               {selectedType?.text} Price
//             </div>

//             {/* If no prices, show add for all states */}
//             {isEmpty(configList) && !appState.isLoading ? (
//               <div className="flex flex-col gap-4 mt-6">
//                 <div className="text-sm text-color-subtext mb-2">
//                   Add Prices for Each State:
//                 </div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <Input
//                     name="bulkPrice"
//                     placeholder="Bulk price for all states"
//                     type="number"
//                     value={bulkPrice}
//                     onChange={(e) => setBulkPrice(e.target.value)}
//                     control={control}
//                     setValue={setValue}
//                     boxWrapperClass="h-[40px]"
//                     wrapperClass="w-[200px]"
//                   />
//                  <Button
//   type="button"
//   onClick={handleBulkAdd}
//   loading={isBulkLoading}
//   disabled={isBulkLoading || !bulkPrice}
// >
//   Set All States
// </Button>
//                 </div>
//                 {indianStates.map((state, index) => (
//                   <div key={index} className="flex items-center gap-2 max-w-[400px]">
//                     <div className="w-[200px] text-sm">{state.name}</div>
//                     <Input
//                       name={`state-${index}`}
//                       placeholder="Enter price"
//                       type="number"
//                       value={addValues[state?.code] || ""}
//                       onChange={(e) =>
//                         setAddValues((prev) => ({
//                           ...prev,
//                           [state?.code]: e.target.value,
//                         }))
//                       }
//                       control={control}
//                       setValue={setValue}
//                       boxWrapperClass="h-[40px]"
//                       wrapperClass="w-full"
//                     />
//                   <Button
//   type="button"
//   size="sm"
//   onClick={async () => {
//     await handleSingleAdd(state, addValues[state?.code]);
//   }}
//   disabled={!addValues[state?.code]}
// >
//   Add
// </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // If prices exist, show editable list
//               <ul
//                 ref={listRef}
//                 className="flex flex-col gap-6 w-full max-w-[400px] max-h-[calc(100vh-500px)] overflow-y-auto"
//               >
//                 {configList?.map(({ id, item, price }, index) => (
//                   <li
//                     key={id || index}
//                     className="grid grid-cols-[1fr_120px_80px] items-center text-color-subtext py-2 mr-4 text-sm border-t border-b border-color-border"
//                   >
//                     <div>{item?.name || item}</div>
//                     {editIndex === index ? (
//                       <>
//                         <Input
//                           name={`edit-${index}`}
//                           placeholder="Enter here"
//                           value={editValue}
//                           type="number"
//                           setValue={setValue}
//                           onChange={(e) => setEditValue(e.target.value)}
//                           control={control}
//                           errors={errors}
//                           boxWrapperClass="h-[40px]"
//                           wrapperClass="w-full"
//                         />
//                        <Button
//   type="button"
//   size="sm"
//   onClick={() => updateData(id, editValue)}
//   disabled={!editValue || editValue === price}
// >
//   Update
// </Button>
//                         <Button
//                           type="button"
//                           size="sm"
//                           variant="outline"
//                           onClick={() => {
//                             setEditIndex(null)
//                             setEditValue("")
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <div className="w-full">{price}</div>
//                         <Button
//                           type="button"
//                           size="sm"
//                           onClick={() => {
//                             setEditIndex(index)
//                             setEditValue(price)
//                           }}
//                         >
//                           Edit
//                         </Button>
//                       </>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {/* Bulk update for existing prices */}
//             {!isEmpty(configList) && (
//               <div className="flex items-center gap-2 mt-8">
//                 <Input
//                   name="bulkUpdate"
//                   placeholder="Bulk update price for all states"
//                   type="number"
//                   value={bulkPrice}
//                   onChange={(e) => setBulkPrice(e.target.value)}
//                   control={control}
//                   setValue={setValue}
//                   boxWrapperClass="h-[40px]"
//                   wrapperClass="w-[200px]"
//                 />
//                <Button
//   type="button"
//   onClick={handleBulkUpdate}
//   loading={isBulkLoading}
//   disabled={isBulkLoading || !bulkPrice}
// >
//   Update All States
// </Button>
//               </div>
//             )}
//           </form>
//         )}
//       </Card>

//       <Tooltip id="tooltip" place="top" className="z-[1100]" />
//     </BELayout>
//   )
// }


"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

const indianStates = [
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
  { name: "Himachal Pradesh", code: "HP" },
  { name: "Jharkhand", code: "JH" },
  { name: "Karnataka", code: "KA" },
  { name: "Kerala", code: "KL" },
  { name: "Madhya Pradesh", code: "MP" },
  { name: "Maharashtra", code: "MH" },
  { name: "Manipur", code: "MN" },
  { name: "Meghalaya", code: "ML" },
  { name: "Mizoram", code: "MZ" },
  { name: "Nagaland", code: "NL" },
  { name: "Odisha", code: "OR" },
  { name: "Punjab", code: "PB" },
  { name: "Rajasthan", code: "RJ" },
  { name: "Sikkim", code: "SK" },
  { name: "Tamil Nadu", code: "TN" },
  { name: "Telangana", code: "TS" },
  { name: "Tripura", code: "TR" },
  { name: "Uttar Pradesh", code: "UP" },
  { name: "Uttarakhand", code: "UK" },
  { name: "West Bengal", code: "WB" },
  { name: "Andaman and Nicobar Islands", code: "AN" },
  { name: "Chandigarh", code: "CH" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
  { name: "Delhi", code: "DL" },
  { name: "Jammu and Kashmir", code: "JK" },
  { name: "Ladakh", code: "LA" },
  { name: "Lakshadweep", code: "LD" },
  { name: "Puducherry", code: "PY" }
]

const dropDownType: IOption[] = [
  { id: "College Cutoff - UG", text: "W College Cutoff - UG" },
  { id: "College Cutoff - PG", text: "W College Cutoff - PG" },
  { id: "College Cutoff - MDS", text: "W College Cutoff - MDS" },
  { id: "College Cutoff - SS", text: "W College Cutoff - PG" },
  { id: "College Cutoff - DNB", text: "W College Cutoff - DNB" },
  { id: "College Cutoff - INICET", text: "W College Cutoff - INICET" },
  { id: "College Cutoff - AIAPGET", text: "W College Cutoff - AIAPGET (Ayurveda)" },
  { id: "College Predictor", text: "College Predictor" },
  { id: "Single College Closing Rank - UG", text: "Single College Closing Rank - UG" },
  { id: "Single College Closing Rank - PG", text: "Single College Closing Rank - PG" },
  { id: "Single College Closing Rank - MDS", text: "Single College Closing Rank - MDS" },
  { id: "Single College Closing Rank - SS", text: "Single College Closing Rank - SS" },
  { id: "Single College Closing Rank - DNB", text: "Single College Closing Rank - DNB" },
  { id: "Single College Closing Rank - INICET", text: "Single College Closing Rank - INICET" },
  { id: "Single College Closing Rank - AIAPGET", text: "Single College Closing Rank - AIAPGET (Ayurved)" },
  { id: "State Closing Rank - UG", text: "State Closing Rank - UG" },
  { id: "State Closing Rank - PG", text: "State Closing Rank - PG" },
  { id: "State Closing Rank - MDS", text: "State Closing Rank - MDS" },
  { id: "All India Closing Rank - UG", text: "All India Closing Rank - UG" },
  { id: "All India Closing Rank - PG", text: "All India Closing Rank - PG" },
  { id: "All India Closing Rank - MDS", text: "All India Closing Rank - MDS" },
  { id: "All India Closing Rank - DNB", text: "All India Closing Rank - DNB" },
  { id: "All India Closing Rank - INICET", text: "All India Closing Rank - INICET" },
  { id: "All India Closing Rank - AIAPGET", text: "All India Closing Rank - AIAPGET (Ayurveda)" },
  { id: "All India Closing Rank - SS", text: "All India Closing Rank - SS" },
  { id: "Packages", text: "Packages" },
]

export default function ConfigurePricesPage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<IOption | undefined>()
  const [bulkPrice, setBulkPrice] = useState<string>("")
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [addValues, setAddValues] = useState<{ [code: string]: string }>({})

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()
  const { appState } = useAppState()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (selectedType) getData(selectedType.id)
    setBulkPrice("")
    setAddValues({})
    setEditIndex(null)
    setEditValue("")
  }, [selectedType])

  async function getData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure_prices/get",
      params: { type },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, price: text } : item)),
    )
  }

  // Single update
  async function updateData(id?: string, price?: string) {
    if (!id || !String(price)?.trim()) return
    const res = await fetchData({
      url: "/api/admin/configure_prices/update",
      method: "POST",
      data: { id, price: Number(price) },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(selectedType!.id)
      setEditIndex(null)
      setEditValue("")
    }
  }

  // Bulk update
  async function handleBulkUpdate() {
    if (!bulkPrice || isNaN(Number(bulkPrice))) {
      showToast("error", "Enter a valid price")
      return
    }
    setIsBulkLoading(true)
    try {
      await fetchData({
        url: "/api/admin/configure_prices/update",
        method: "POST",
        data: {
          price: Number(bulkPrice),
          type: selectedType?.id,
          isBulkUpdate: true,
        },
      })
      showToast("success", "Bulk prices updated for all states")
      getData(selectedType!.id)
      setBulkPrice("")
    } catch (e) {
      showToast("error", "Bulk update failed")
    } finally {
      setIsBulkLoading(false)
    }
  }

  // Bulk add prices for all states
  async function handleBulkAdd() {
    if (!bulkPrice || isNaN(Number(bulkPrice))) {
      showToast("error", "Enter a valid price")
      return
    }
    setIsBulkLoading(true)
    try {
      await fetchData({
        url: "/api/admin/configure_prices/add",
        method: "POST",
        data: {
          price: Number(bulkPrice),
          type: selectedType?.id,
          isBulkAdd: true,
        },
      })
      showToast("success", "Bulk prices added for all states")
      getData(selectedType!.id)
      setBulkPrice("")
      setAddValues({})
    } catch (e) {
      showToast("error", "Bulk add failed")
    } finally {
      setIsBulkLoading(false)
    }
  }

  // Add price for a single state
  async function handleSingleAdd(state: any, price: string) {
    if (!price || isNaN(Number(price))) {
      showToast("error", "Enter a valid price")
      return
    }
    await fetchData({
      url: "/api/admin/configure_prices/add",
      method: "POST",
      data: {
        item: state,
        price: Number(price),
        type: selectedType?.id,
      },
    })
    getData(selectedType!.id)
    setAddValues((prev) => ({ ...prev, [state?.code]: "" }))
  }

  // States for which price is already set
  const statesWithPrice = new Set(configList.map((c) => c.item?.code))

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Prices</Heading>

      <Card className="mt-4 p-6 min-h-[400px]">
        <div className="w-full max-w-96">
          <SearchAndSelect
            name="dropDownType"
            label="Select Option"
            placeholder="Select Option"
            value={selectedType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, () => {})
              setSelectedType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={dropDownType}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, dropDownType, setOptions)
            }
            errors={errors}
          />
        </div>

        {shouldRenderComponent([selectedType], "AND") && (
          <form className="w-full">
            <div className="text-xl text-color-text mt-8 mb-4">
              {selectedType?.text} Price
            </div>

            {/* If no prices, show add for all states */}
            {isEmpty(configList) && !appState.isLoading ? (
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-sm text-color-subtext mb-2">
                  Add Prices for Each State:
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    name="bulkPrice"
                    placeholder="Bulk price for all states"
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    control={control}
                    setValue={setValue}
                    boxWrapperClass="h-[40px]"
                    wrapperClass="w-[200px]"
                  />
                  <Button
                    type="button"
                    onClick={handleBulkAdd}
                    loading={isBulkLoading}
                    disabled={isBulkLoading || !bulkPrice}
                  >
                    Set All States
                  </Button>
                </div>
                {indianStates.map((state, index) => (
                  <div key={index} className="flex items-center gap-2 max-w-[400px]">
                    <div className="w-[200px] text-sm">{state.name}</div>
                    <Input
                      name={`state-${index}`}
                      placeholder="Enter price"
                      type="number"
                      value={addValues[state?.code] || ""}
                      onChange={(e) =>
                        setAddValues((prev) => ({
                          ...prev,
                          [state?.code]: e.target.value,
                        }))
                      }
                      control={control}
                      setValue={setValue}
                      boxWrapperClass="h-[40px]"
                      wrapperClass="w-full"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        await handleSingleAdd(state, addValues[state?.code]);
                      }}
                      disabled={!addValues[state?.code]}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              // If prices exist, show editable list
              <ul
                ref={listRef}
                className="flex flex-col gap-6 w-full max-w-[400px] max-h-[calc(100vh-500px)] overflow-y-auto"
              >
                {configList?.map(({ id, item, price }, index) => (
                  <li
                    key={id || index}
                    className="grid grid-cols-[1fr_120px_80px] items-center text-color-subtext py-2 mr-4 text-sm border-t border-b border-color-border"
                  >
                    <div>{item?.name || item}</div>
                    {editIndex === index ? (
                      <>
                        <Input
                          name={`edit-${index}`}
                          placeholder="Enter here"
                          value={editValue}
                          type="number"
                          setValue={setValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          control={control}
                          errors={errors}
                          boxWrapperClass="h-[40px]"
                          wrapperClass="w-full"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => updateData(id, editValue)}
                          disabled={!editValue || editValue === price}
                        >
                          Update
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditIndex(null)
                            setEditValue("")
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-full">{price}</div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setEditIndex(index)
                            setEditValue(price)
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Bulk update for existing prices */}
            {!isEmpty(configList) && (
              <div className="flex items-center gap-2 mt-8">
                <Input
                  name="bulkUpdate"
                  placeholder="Bulk update price for all states"
                  type="number"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  control={control}
                  setValue={setValue}
                  boxWrapperClass="h-[40px]"
                  wrapperClass="w-[200px]"
                />
                <Button
                  type="button"
                  onClick={handleBulkUpdate}
                  loading={isBulkLoading}
                  disabled={isBulkLoading || !bulkPrice}
                >
                  Update All States
                </Button>
              </div>
            )}
          </form>
        )}
      </Card>

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}