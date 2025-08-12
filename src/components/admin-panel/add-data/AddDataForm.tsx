"use client"

import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { createAdminSupabaseClient } from "@/lib/supabase"
import { IOption } from "@/types/GlobalTypes"
import { courseType, instituteTypes, states, years } from "@/utils/static"
import {
  autoComplete,
  clearReactHookFormValueAndStates,
  createPayload,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { Delete, Save } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const filteredStates = states.slice(1)

interface IFormData {
  instituteName?: string
  instituteType?: IOption
  state?: IOption
  courses?: IOption
  quotas?: IOption
  subQuota?: IOption
  subCategory?: IOption
  categories?: IOption
  fees?: number | string
  closingRankR1?: string
  closingRankR2?: string
  closingRankR3?: string
  strayRound?: string
  lastStrayRound?: string
  prevClosingRankR1?: string
  prevClosingRankR2?: string
  prevClosingRankR3?: string
  prevStrayRound?: string
  prevLastStrayRound?: string
  year?: IOption
  counsellingType?: IOption
  counsellingTypeList?: IOption
  courseType?: IOption
  predictorDataList?: IOption
  filteredCounsellingTypeDataList?: IOption
  quotaTypeList?: IOption
}

type State = {
  id?: number
  code?: string
  name?: string
}
export interface IOptionProps {
  sub_categories?: never[]
  id: any
  text: string
  disable?: boolean
  otherValues?: any
  code?:string
  type?:string
}
const predictorDataList: IOption[] = [
  { id: 1, text: "NEET UG" },
  { id: 2, text: "NEET PG" },
  { id: 3, text: "NEET MDS" },
  { id: 4, text: "DNB" },
  { id: 5, text: "INICET" },
  { id: 6, text: "NEET SS" },
]

const counsellingTypeDataList = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]
export default function AddDataForm({ editMode }: { editMode?: boolean }) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>()
  const [defaultValues, setDefaultValues] = useState<IFormData>()
  const [quotasList, setQuotasList] = useState<IOption[]>([])
  const [categoriesList, setCategoriesList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [counsellingTypeList, setCounsellingList] = useState<IOption[]>([])
  const [subQuotasList, setSubQuotasList] = useState<IOption[]>([])
  const [subCategoriesList, setSubCategoriesList] = useState<IOption[]>([])

  const [courseTypeList, setCourseTypeList] = useState<IOption[]>([])

  const [stateList, setStateList] = useState<IOption[]>([])
    const searchParams = useSearchParams()
  const stateCode = searchParams.get("stateCode")||""
  const params = useParams()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()

  const allowedPredictorIds = ["NEET UG", "NEET PG", "NEET MDS"]

  const filteredCounsellingTypeDataList: IOption[] =
    allowedPredictorIds.includes(formData?.courseType?.text || "")
      ? counsellingTypeDataList
      : [counsellingTypeDataList[0]]

  useEffect(() => {
    if (editMode) {
      getDataById(params?.id,stateCode)
    }

    getConfigData()
  }, [params?.id,stateCode])

  async function getConfigData() {
    const [quotaData, categoryData] = await Promise.all([
      fetchData({ url: "/api/admin/configure/get", params: { type: "QUOTA" } }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CATEGORY" },
      }),
    ])

    setQuotasList(quotaData?.payload?.data || [])
    setCategoriesList(categoryData?.payload?.data || [])
  }

  async function getConfigCourseType() {
    const [courseType] = await Promise.all([
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "COURSETYPE" },
      }),
    ])
    console.log("For Test: ", courseType)

    setCourseTypeList(courseType?.payload?.data || [])
    // setCategoriesList(categoryData?.payload?.data || [])
  }

  async function getCourses() {
    try {
      const res = await fetch("/api/get-courses-types")
      const json = await res.json()
// console.log()
      if (!json?.data || !Array.isArray(json.data)) {
        // console.error(
        //   "Invalid data structure from /api/get-courses-types",
        //   json,
        // )
        return []
      }

      const data = json.data.map((q:IOptionProps) => ({
        id: q.id,
        text: q.type,
      }))
      return data
    } catch (error) {
      console.error("getCourses error:", error)
      return [] // Always return fallback
    }
  }


  async function getCoursesBasedOnCourseType(type: string) {
    try {
      const res = await fetch(
        `/api/get-courses?type=${encodeURIComponent(type)}`,
      )
      const { data } = await res.json()

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id,
          text: item.text, // <-- mapping `type` to `text` key
        }))
        setCoursesList(mapped)
      } else {
        setCoursesList([])
      }

      console.log("Mapped Course List data: ", data, type)
    } catch (error) {
      console.log("Error in course list fetch", error)
    }
  }

  useEffect(() => {
    const courseType = async () => {
      try {
        const data = await getCourses()
        setCourseTypeList(data)
        console.log("Course Data: ", data)
      } catch (error) {
        console.log(error)
      }
    }
    courseType()
  }, [])

  async function getDataById(id: any,stateCode:string) {
    const res = await fetchData({
      url: "/api/admin/get_data_by_id",
      params: {
        id,stateCode
      },
    })

    const data = res?.payload?.data

    const formatData = {
      instituteType: {
        text: data?.instituteType,
        id: data?.instituteType,
      },
      state: {
        text: data?.state,
        id: data?.state,
      },
      courses: {
        text: data?.course,
        id: data?.course,
      },
      courseType: {
        text: data?.courseType,
        id: data?.courseType,
      },
      quotas: {
        text: data?.quota,
        id: data?.quota,
      },
      categories: {
        text: data?.category,
        id: data?.category,
      },

      year: {
        text: String(data?.year),
        id: String(data?.year),
      },
    }
//current year 
    const r1 = data?.closingRankR1
    const r2 = data?.closingRankR2
     
   
    const r3 = data?.closingRankR3
    
    const sr = data?.strayRound
    
    const lsr = data?.lastStrayRound
     

// prev year
    const pr1 = data?.prevClosingRankR1 
    const pr2 = data?.prevClosingRankR2
     
    const pr3 = data?.prevClosingRankR3
     
    const pSr = data?.prevStrayRound
     
    const pLsr = data?.prevLastStrayRound
     

    setFormData({
      instituteName: data?.instituteName,
      fees: data?.fees,
      closingRankR1: r1,
      closingRankR2: r2,
      closingRankR3: r3,
      strayRound: sr,
      lastStrayRound: lsr,
      prevClosingRankR1: pr1,
      prevClosingRankR2: pr2,
      prevClosingRankR3: pr3,
      prevStrayRound: pSr,
      prevLastStrayRound: pLsr,
    })

    setDefaultValues(formatData)
  }

  async function fetchCounsellingTypes() {
    const res = await fetch("/api/counselling-types")
    const json = await res.json()
    return json.data
  }
  const fetchStates = async () => {
    const res = await fetch("/api/states")
    const json = await res.json()
    console.log("State: ", json)
    return json.data
  }



  useEffect(() => {
    fetchStates()
      .then(setStateList)
      .catch((err) => console.error("State load error:", err))
  }, [])



  async function fetchQuotas(counsellingTypeId: string, stateCode?: string) {
    const url = new URL("/api/quota-types", window.location.origin)
    url.searchParams.set("counselling_type_id", counsellingTypeId)
    if (stateCode) url.searchParams.set("state_code", stateCode)

    const res = await fetch(url.toString())
    const json = await res.json()

    const quotas = json.data.map((q:IOptionProps) => ({
      ...q, // Spread all fields including sub_quotas
      id: q.id,
      text: q.text,
    }))

    return quotas
  }



  async function fetchCategoryTypes(quotaId: string) {
    const url = new URL("/api/category-types", window.location.origin)
    url.searchParams.set("quota_type_id", quotaId)
    const res = await fetch(url.toString())
    const json = await res.json()
    return json.data
  }

  useEffect(() => {
    const fetchQ = async () => {
      try {

        const data = await fetchQuotas(
          formData?.counsellingType?.id,
          formData?.state?.code || formData?.state?.id,
        )

        console.log("Received quota data:", data)
        setQuotasList(data)
      } catch (error) {
        console.error("Failed to load quota types:", error)
      }
    }

    if (
      formData?.counsellingType?.id === 1 ||
      (formData?.counsellingType?.id === 2 && formData?.state?.id)
    ) {
      fetchQ()
    }
  }, [
    formData?.counsellingType?.id,
    formData?.state?.id,
    formData?.state?.code,
  ])


  useEffect(() => {
    const loadCategories = async () => {
      if (formData?.quotas?.id) {
        const data = await fetchCategoryTypes(formData?.quotas?.id)
if(data && Array.isArray(data))
        setCategoriesList(
          data.map((cat:IOptionProps) => ({
            id: cat?.id,
            text: cat?.text,
            otherValues: {
              sub_categories: cat?.sub_categories || [],
            },
          })),
        )
      }
    }

    loadCategories()
  }, [formData?.quotas?.id])

  useEffect(() => {
    const loadCounsellingTypes = async () => {
      try {
        const data = await fetchCounsellingTypes()
        console.log("Counselling Data: ", data)
        setCounsellingList(data || []) // Assuming you want to store this data in state
      } catch (error) {
        console.error("Failed to load counselling types:", error)
      }
    }

    loadCounsellingTypes()
  }, [])

  async function onSubmit() {
    const payload = createPayload({
      instituteName: formData?.instituteName,
      instituteType: formData?.instituteType?.text,
      course: formData?.courses?.text,
      courseType: formData?.courseType?.text,
      quota: formData?.quotas?.text,
      subQuota: formData?.subQuota?.text,
      category: formData?.categories?.text,
      subCategory: formData?.subCategory?.text,
      fees: formData?.fees,
      closingRankR1: formData?.closingRankR1?.split("/")?.[0],
      closingRankR2: formData?.closingRankR2?.split("/")?.[0],
      closingRankR3: formData?.closingRankR3?.split("/")?.[0],
      strayRound: formData?.strayRound?.split("/")?.[0],
      lastStrayRound: formData?.lastStrayRound?.split("/")?.[0],
      cRR1: formData?.closingRankR1?.split("/")?.[1]?.trim() ?? null,
      cRR2: formData?.closingRankR2?.split("/")?.[1]?.trim(),
      cRR3: formData?.closingRankR3?.split("/")?.[1]?.trim(),
      sRR: formData?.strayRound?.split("/")?.[1]?.trim(),
      lSRR: formData?.lastStrayRound?.split("/")?.[1]?.trim(),

      prevClosingRankR1: formData?.prevClosingRankR1?.split("/")?.[0],
      prevClosingRankR2: formData?.prevClosingRankR2?.split("/")?.[0],
      prevClosingRankR3: formData?.prevClosingRankR3?.split("/")?.[0],
      prevStrayRound: formData?.prevStrayRound?.split("/")?.[0],
      prevLastStrayRound: formData?.prevLastStrayRound?.split("/")?.[0],
      prevCRR1: formData?.prevClosingRankR1?.split("/")?.[1]?.trim() ?? null,
      prevCRR2: formData?.prevClosingRankR2?.split("/")?.[1]?.trim(),
      prevCRR3: formData?.prevClosingRankR3?.split("/")?.[1]?.trim(),
      prevSRR: formData?.prevStrayRound?.split("/")?.[1]?.trim(),
      prevlSRR: formData?.prevLastStrayRound?.split("/")?.[1]?.trim(),   

      stateCode : formData?.state?.code
    })
    const uploadPayload = createPayload({
           fees: formData?.fees,
      closingRankR1: formData?.closingRankR1?.split("/")?.[0],
      closingRankR2: formData?.closingRankR2?.split("/")?.[0],
      closingRankR3: formData?.closingRankR3?.split("/")?.[0],
      strayRound: formData?.strayRound?.split("/")?.[0],
      lastStrayRound: formData?.lastStrayRound?.split("/")?.[0],
      cRR1: formData?.closingRankR1?.split("/")?.[1]?.trim() ?? null,
      cRR2: formData?.closingRankR2?.split("/")?.[1]?.trim(),
      cRR3: formData?.closingRankR3?.split("/")?.[1]?.trim(),
      sRR: formData?.strayRound?.split("/")?.[1]?.trim(),
      lSRR: formData?.lastStrayRound?.split("/")?.[1]?.trim(),

      prevClosingRankR1: formData?.prevClosingRankR1?.split("/")?.[0],
      prevClosingRankR2: formData?.prevClosingRankR2?.split("/")?.[0],
      prevClosingRankR3: formData?.prevClosingRankR3?.split("/")?.[0],
      prevStrayRound: formData?.prevStrayRound?.split("/")?.[0],
      prevLastStrayRound: formData?.prevLastStrayRound?.split("/")?.[0],
      prevCRR1: formData?.prevClosingRankR1?.split("/")?.[1]?.trim() ?? null,
      prevCRR2: formData?.prevClosingRankR2?.split("/")?.[1]?.trim(),
      prevCRR3: formData?.prevClosingRankR3?.split("/")?.[1]?.trim(),
      prevSRR: formData?.prevStrayRound?.split("/")?.[1]?.trim(),
      prevlSRR: formData?.prevLastStrayRound?.split("/")?.[1]?.trim(),   
  stateCode : formData?.state?.code
    })

    if (editMode) {
      const res = await fetchData({
        url: `/api/admin/update_data/${params?.id}?stateCode=${formData?.state?.code}`,
        method: "PUT",
        data: uploadPayload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)
      }
    } else {

      // console.log(payload)
      const res = await fetchData({
        url: "/api/admin/add_data",
        method: "POST",
        data: payload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)
      }
    }
  }

  function naCheck(text: string) {
    if (text === "N/A") {
      return true
    }
  }

  function clearAll() {
    clearReactHookFormValueAndStates(
      [
        "instituteName",
        "instituteType",
        "state",
        "courses",
        "courseType",
        "quotas",
        "categories",
        "fees",
        "closingRankR1",
        "closingRankR2",
        "closingRankR3",
        "strayRound",
        "year",
      ],
      setValue,
      setFormData,
    )
  }

  async function getCoursesData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure/courses/get",
      params: { type },
    })

    if (res?.payload?.data?.length > 0) {
      setCoursesList(res?.payload?.data)
    }
  }

  return (
    <div>
      <div className="flex items-center flex-wrap gap-8 w-full mb-4">
        <SearchAndSelect
          name="course Type"
          label="Course Type"
          placeholder="Select Course Type"
          value={formData?.courseType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
            // console.log(selectedValue)
            getCoursesBasedOnCourseType(selectedValue?.text)
            setFormData((prev) => ({
              ...prev,
              courseType: selectedValue,
              counsellingType: undefined,
            }))
          }}
          control={control}
          setValue={setValue}
          required
          options={courseTypeList}
          debounceDelay={0}
          defaultOption={defaultValues?.courseType}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, courseTypeList, setOptions)
          }
          errors={errors}
        />

        <SearchAndSelect
          name="counselling Type"
          label="Counselling Type"
          placeholder="Select Counselling Type"
          value={formData?.counsellingType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
            // setCounsellingList()
            console.log(selectedValue, formData)
            // setId(selectedValue?.id)
            setFormData((prev) => ({
              ...prev,
              counsellingType: selectedValue,
              state: undefined,
              quotas: undefined,
              categories: undefined,
            }))

            setQuotasList([])
            setCategoriesList([])
          }}
          control={control}
          setValue={setValue}
          required
          options={filteredCounsellingTypeDataList}
          debounceDelay={0}
          disabled={!formData?.courseType?.id}
          defaultOption={defaultValues?.filteredCounsellingTypeDataList}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, filteredCounsellingTypeDataList, setOptions)
          }
          errors={errors}
        />
        {formData?.counsellingType?.id == 2 && (
          <SearchAndSelect
            name="state"
            label="State"
            placeholder="Search and Select"
            value={formData?.state}
            // onChange={({ name, selectedValue }) => {
            //   onOptionSelected(name, selectedValue, setFormData)

            //   console.log(selectedValue)
            //   setFormData((prev) => ({
            //     ...prev,
            //     state: selectedValue,
            //     quotas: undefined,
            //     categoryType: undefined,
            //   }))

            //   setQuotasList([])
            //   setSategoryTypeList([])
            // }}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)

              setFormData((prev) => ({
                ...prev,
                state: selectedValue,
                quotas: undefined,
                categories: undefined,
                subQuota: undefined, // <-- Add this
                subCategory: undefined, // <-- Add this
              }))

              setQuotasList([])
              setCategoriesList([])
              setSubQuotasList([]) // <-- Add this
              setSubCategoriesList([]) // <-- Add this
            }}
            control={control}
            setValue={setValue}
            required
            options={stateList}
            debounceDelay={0}
            defaultOption={defaultValues?.state}
            searchAPI={(text, setOptions) =>
              autoComplete(text, stateList, setOptions)
            }
            errors={errors}
          />
        )}

        <div className="flex items-center flex-wrap gap-2">
          <SearchAndSelect
            name="quotas"
            label="Quota"
            placeholder="Select Quota"
            value={formData?.quotas}
            // onChange={({ name, selectedValue }) => {
            //   onOptionSelected(name, selectedValue, setFormData)
            //   setFormData((prev) => ({
            //     ...prev,
            //     quotas: selectedValue,
            //     subQuota: undefined,
            //     categories: undefined,
            //   }))

            //   setCategoriesList([])

            //   const found = quotasList.find((q) => q.id === selectedValue?.id)
            //   const subs = found?.sub_quotas || []
            //   setSubQuotasList(subs)
            // }}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)

              setFormData((prev) => ({
                ...prev,
                quotas: selectedValue,
                subQuota: undefined,
                categories: undefined,
                subCategory: undefined, // <-- Add this
              }))

              setCategoriesList([])
              setSubCategoriesList([]) // <-- Add this

              const found = quotasList.find((q) => q.id === selectedValue?.id)
              const subs = found?.sub_quotas || []
              setSubQuotasList(subs)
            }}
            control={control}
            setValue={setValue}
            required
            options={quotasList}
            debounceDelay={0}
            disabled={
              !formData?.courseType?.id ||
              !formData?.counsellingType?.id ||
              (formData?.counsellingType?.id == 2 && !formData?.state?.id)
            }
            defaultOption={defaultValues?.quotas}
            wrapperClass="max-w-[395px]"
            searchAPI={(text, setOptions) =>
              autoComplete(text, quotasList, setOptions)
            }
            errors={errors}
          />
          {subQuotasList.length > 0 && (
            <SearchAndSelect
              name="subQuota"
              label="Sub Quota"
              placeholder="Select Sub Quota"
              value={formData?.subQuota}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={subQuotasList}
              debounceDelay={0}
              defaultOption={defaultValues?.subQuota}
              wrapperClass="max-w-[395px]"
              searchAPI={(text, setOptions) =>
                autoComplete(text, subQuotasList, setOptions)
              }
              errors={errors}
            />
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <SearchAndSelect
            name="categories"
            label="Category"
            placeholder="Select Category"
            value={formData?.categories}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)

              setFormData((prev) => ({
                ...prev,
                categories: selectedValue,
                subCategory: undefined,
              }))

              const found = categoriesList.find(
                (cat) => cat.id === selectedValue?.id,
              )
              const subs = found?.otherValues?.sub_categories || []
              setSubCategoriesList(subs)
            }}
            control={control}
            setValue={setValue}
            required
            options={categoriesList}
            debounceDelay={0}
            defaultOption={defaultValues?.categories}
            disabled={!formData?.quotas?.id || categoriesList.length === 0}
            wrapperClass="max-w-[395px]"
            searchAPI={(text, setOptions) =>
              autoComplete(text, categoriesList, setOptions)
            }
            errors={errors}
          />
          {subCategoriesList.length > 0 && (
            <SearchAndSelect
              name="subCategory"
              label="Sub Category"
              placeholder="Select Sub Category"
              value={formData?.subCategory}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={subCategoriesList}
              debounceDelay={0}
              defaultOption={defaultValues?.subCategory}
              wrapperClass="max-w-[395px]"
              searchAPI={(text, setOptions) =>
                autoComplete(text, subCategoriesList, setOptions)
              }
              errors={errors}
            />
          )}
        </div>
      </div>

      <SearchAndSelect
        name="courses"
        label="Course"
        placeholder="Search and Select"
        value={formData?.courses}
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
        }}
        control={control}
        required
        setValue={setValue}
        options={coursesList}
        debounceDelay={0}
        defaultOption={defaultValues?.courses}
        searchAPI={(text, setOptions) =>
          autoComplete(text, coursesList, setOptions)
        }
        disabled={isEmpty(coursesList)}
        errors={errors}
      />
      <Card className="mt-4 p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <ResponsiveGrid className="py-3">
            <Input
              name="instituteName"
              label="Institute Name"
              type="text"
              placeholder="Enter here"
              value={formData?.instituteName}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              setValue={setValue}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <SearchAndSelect
              name="instituteType"
              label="Institute Type"
              placeholder="Search and Select"
              value={formData?.instituteType}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={instituteTypes}
              debounceDelay={0}
              defaultOption={defaultValues?.instituteType}
              searchAPI={(text, setOptions) =>
                autoComplete(text, instituteTypes, setOptions)
              }
              errors={errors}
            />

            <Input
              name="fees"
              label="Fees"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.fees}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
       </ResponsiveGrid>

       <div className="">

  <div className ="mb-2 text-bold text-xl">Current Year:-</div>
            <div className="flex flex-wrap gap-10">
            <Input
              name="closingRankR1"
              label="Closing Rank (R1)"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
             value={formData?.prevClosingRankR1??""}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                // required: true,
              }}
              errors={errors}
            />
            <Input
              name="closingRankR2"
              label="Closing Rank (R2)"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.closingRankR2}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="closingRankR3"
              label="Closing Rank (R3)"
              type="text"
              placeholder="Enter here"
              value={formData?.closingRankR3}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="strayRound"
              label="Stray Round"
              type="text"
              placeholder="Enter here"
              value={formData?.strayRound}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="lastStrayRound"
              label="Last Stray Round"
              type="text"
              placeholder="Enter here"
              value={formData?.lastStrayRound}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            </div>     </div>



       <div className="">

  <div className ="mb-2 text-bold text-xl">Previous Year:-</div>
         <div className="flex flex-row flex-wrap gap-10">
            <Input
              name="prevClosingRankR1"
              label="Prev Closing Rank (R1)"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.prevClosingRankR1??""}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
              }}
              errors={errors}
            />
            <Input
              name="prevClosingRankR2"
              label="PrevClosing Rank (R2)"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.prevClosingRankR2}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="prevClosingRankR3"
              label="Prev Closing Rank (R3)"
              type="text"
              placeholder="Enter here"
              value={formData?.prevClosingRankR3}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="prevStrayRound"
              label="Prev Stray Round"
              type="text"
              placeholder="Enter here"
              value={formData?.prevStrayRound}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            <Input
              name="prevLastStrayRound"
              label="Prev Last Stray Round"
              type="text"
              placeholder="Enter here"
              value={formData?.prevLastStrayRound}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
            </div>
            </div>
   

          <div className="mt-6 ml-auto flex items-center gap-6">
            <Button
              className="px-4 bg-transparent border bg-red-500 flex items-center gap-2 hover:bg-red-600"
              type="button"
              onClick={clearAll}
            >
              <Delete size={22} />
              Clear Form
            </Button>

            <Button
              className="flex items-center gap-2 px-6 bg-green-500 hover:bg-green-600"
              type="submit"
            >
              {editMode ? "Update Data" : "Save Data"}
              <Save size={22} />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

