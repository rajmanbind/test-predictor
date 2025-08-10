"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { states } from "@/utils/static"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

const domicileStates: IOption[] = states.slice(1)

// interface IFormData {
//   rank?: number | string
//   domicileState?: IOption
//   courses?: IOption
//   predictorType?: IOption
//   predictoryType?: IOption
// }


interface IFormData {
  rank?: number | string
  state?: IOption
  courses?: IOption
  quotas?: IOption
  subQuota?: IOption
  subCategory?: IOption
  categories?: IOption
  counsellingType?: IOption
  counsellingTypeList?: IOption
  predictorType?: IOption
  predictorDataList?: IOption
  filteredCounsellingTypeDataList?: IOption
  quotaTypeList?: IOption
}

const counsellingTypeDataList = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]
export function CollegePredictorTest() {
  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>({
    rank: "",
  })





    const [defaultValues, setDefaultValues] = useState<IFormData>()
    const [quotasList, setQuotasList] = useState<IOption[]>([])
    const [categoriesList, setCategoriesList] = useState<IOption[]>([])
    const [counsellingTypeList, setCounsellingList] = useState<IOption[]>([])
    const [subQuotasList, setSubQuotasList] = useState<IOption[]>([])
    const [subCategoriesList, setSubCategoriesList] = useState<IOption[]>([])
  
  
    const [stateList, setStateList] = useState<IOption[]>([])
  const [radioOption, setRadioOption] = useState(["Rank", "Marks"])
  const [selected, setSelected] = useState("Rank")
  const [predictorTypeList, setpredictorTypeList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])




    const allowedPredictorIds = ["NEET UG", "NEET PG", "NEET MDS"]
  
    const filteredCounsellingTypeDataList: IOption[] =
      allowedPredictorIds.includes(formData?.predictorType?.text || "")
        ? counsellingTypeDataList
        : [counsellingTypeDataList[0]]
  const { fetchData } = useFetch()

  const { setAppState } = useAppState()

  const router = useRouter()


  async function fetchQuotas(counsellingTypeId: string, stateCode?: string) {
    const url = new URL("/api/quota-types", window.location.origin)
    url.searchParams.set("counselling_type_id", counsellingTypeId)
    if (stateCode) url.searchParams.set("state_code", stateCode)

    const res = await fetch(url.toString())
    const json = await res.json()

    const quotas = json.data.map((q:IOption) => ({
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
    const category = json.data.map((q:IOption) => ({
      ...q, // Spread all fields including sub_quotas
      id: q.id,
      text: q.text,
    }))
return category;
    }
  
    useEffect(() => {
      const fetchQ = async () => {
        try {
          // console.log("Fetching quotas with:", {
          //   counsellingId: formData?.counsellingType?.id,
          //   stateId: formData?.state?.id,
          //   stateCode: formData?.state?.code
          // },formData);
  
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
  
          // setCategoriesList(
          //   data.map((cat:IOption) => ({
          //     id: cat.id,
          //     text: cat.text,
          //     otherValues: {
          //       sub_categories: cat.sub_categories || [],
          //     },
          //   })),
          // )
  
          setCategoriesList(data||[])
        }
      }
  
      loadCategories()
    }, [formData?.quotas?.id])
  

  async function getCourses() {
    try {
      const res = await fetch("/api/get-courses-types")
      const json = await res.json()
console.log()
      if (!json?.data || !Array.isArray(json.data)) {
        console.error(
          "Invalid data structure from /api/get-courses-types",
          json,
        )
        return []
      }

      const data = json.data.map((q:IOption) => ({
        id: q.id,
        text: q.type,
      }))
      return data
    } catch (error) {
      console.error("getCourses error:", error)
      return [] // Always return fallback
    }
  }


  async function getCoursesBasedOnpredictorType(type: string) {
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
    const predictorType = async () => {
      try {
        const data = await getCourses()
        setpredictorTypeList(data)
        console.log("Course Data: ", data)
      } catch (error) {
        console.log(error)
      }
    }
    predictorType()
  }, [])






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


//   async function getCoursesData(type: string) {
//     const res = await fetchData({
//       url: "/api/admin/configure/courses/get",
//       params: { type },
//     })

//     if (res?.payload?.data?.length > 0) {
//       // setCoursesList([
//       //   {
//       //     id: "all",
//       //     text: `All ${type === "ug" ? "UG" : "PG"} Courses`,
//       //   },

//       //   ...res?.payload?.data,
//       // ])
// // console.log(coursesList)
//       setCoursesList(res?.payload?.data || [])
//     }
//   }

  function onSubmit() {
    if (selected === "Rank") {
      if (String(formData?.rank).length > 7) {
        setError("rank", {
          type: "manual",
          message: "Rank should not be greater than 7 digits",
        })
        return
      }
    } else {
      if (String(formData?.rank).length > 3) {
        setError("rank", {
          type: "manual",
          message: "Marks should not be greater than 3 digits",
        })
        return
      }
    }

    setAppState({ pageLoader: true })

    const searchParams = new URLSearchParams()

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("rankType", selected || "")
    // searchParams.set("domicileState", formData?.domicileState?.text || "")
    searchParams.set("course", formData?.courses?.text || "")
    searchParams.set("predictorType", formData?.predictorType?.text || "")
    searchParams.set("state", formData?.state?.text || "")
    searchParams.set("stateCode", formData?.state?.code || "")
    
// console.log("PredictorType: ",formData.predictorType?.text)
// console.log("Rank: ",formData?.rank)
// console.log("RankType: ",selected)
// console.log("Course: ",formData?.courses?.text)
// console.log("CounsellingType: ",formData?.counsellingType?.text)
// console.log("Quota: ",formData?.quotas?.text)
// console.log("SubQuota: ",formData?.subQuota?.text)
// console.log("Category: ",formData?.categories?.text)
// console.log("SubQuota: ",formData?.subCategory?.text)
    router.push(`/results?${searchParams.toString()}`)
  }

  function disableCheck() {
    return (
      isEmpty(formData?.rank) ||
      isEmpty(selected) ||
      isEmpty(formData?.predictorType?.text) ||
      // isEmpty(formData?.domicileState?.text) ||
      isEmpty(formData?.courses?.text)
    )
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

// // Close dropdown on outside click
// useEffect(() => {
//   function handleClickOutside(event: MouseEvent) {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//       props.setOpenDropdownName(null)
//     }
//   }

//   document.addEventListener("mousedown", handleClickOutside)
//   return () => document.removeEventListener("mousedown", handleClickOutside)
// }, [])

  return (
    <Card className="mt-2 tab:mx-16 p-7 tab:p-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <h3 className="text-[25px] pc:text-4xl font-bold text-center">
            Predict Your College
          </h3>
          <p className="text-base text-gray-500 text-center poppinsFont">
            Enter your details to find the best college matches
          </p>
        </div>

         <SearchAndSelect
              name="predictory Type"
              label="Pedictory Type"
              placeholder="Select Predictor Type"
              value={formData?.predictorType}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
                console.log(selectedValue)
                getCoursesBasedOnpredictorType(selectedValue?.text)
                setFormData((prev) => ({
                  ...prev,
                  predictorType: selectedValue,
                  counsellingType: undefined,
                }))
              }}
              control={control}
              setValue={setValue}
              required
              options={predictorTypeList}
              debounceDelay={0}
              // defaultOption={defaultValues?.predictorType}
              // wrapperClass="max-w-[395px]"
              searchAPI={(text, setOptions) =>
                autoComplete(text, predictorTypeList, setOptions)
              }
              errors={errors}
            />


 
        <p>What do you have ?</p>

        <div className="flex space-x-6 mt-[-20px]">
          {radioOption.map((option) => (
            <label
              key={option}
              className="relative flex items-center space-x-2 cursor-pointer text-color-text"
            >
              <input
                type="radio"
                name="rankOrMarks"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="peer hidden"
              />
              <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-orange-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:opacity-100 opacity-0 transition-opacity"></div>
              </div>
              <span className="peer-checked:text-orange-500 ">{option}</span>
            </label>
          ))}
        </div>

        <Input
          name="rank"
          label={selected || "Rank"}
          type="number"
          placeholder={`Enter your ${selected || "Rank"}`}
          setValue={setValue}
          value={formData?.rank}
          onChange={(e) => {
            onTextFieldChange(e, setFormData)
            clearErrors("rank")
          }}
          control={control}
          rules={{
            required: false,
          }}
          errors={errors}
        />
       <SearchAndSelect
          name="courses"
          label="Course"
          placeholder="Select your Course"
          value={formData?.courses}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={coursesList}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, coursesList, setOptions)
          }
          errors={errors}
          disabled={isEmpty(formData?.predictorType?.text)}
        />

        {/* <SearchAndSelect
          name="domicileState"
          label="State (Domicile State)"
          placeholder="Select your Domicile State"
          value={formData?.domicileState}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={domicileStates}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, domicileStates, setOptions)
          }
          errors={errors}
        /> */}


                <SearchAndSelect
                  name="counselling Type"
                  label="Counselling Type"
                  placeholder="Select Counselling Type"
                  value={formData?.counsellingType}
                  onChange={({ name, selectedValue }) => {
                    onOptionSelected(name, selectedValue, setFormData)
                    // setCounsellingList()
                    // console.log(selectedValue, formData)
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
                  disabled={!formData?.predictorType?.id}
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
                      !formData?.predictorType?.id ||
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
                    //   onChange={({ name, selectedValue }) => {
                    //   onOptionSelected(name, selectedValue, setFormData)
        
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     categories: selectedValue,
                    //     subCategory: undefined,        // <-- Already correct
                    //   }))
        
                    //   const found = categoriesList.find((cat) => cat.id === selectedValue?.id)
                    //   const subs = found?.otherValues?.sub_categories || []
                    //   setSubCategoriesList(subs)
                    // }}
        
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

        <Button
          className="mt-6"
          onClick={onSubmit}
          // data-tooltip-id={"tooltip"}
          // data-tooltip-content="Coming Soon"
          disabled={disableCheck()}
          // disabled
        >
          Predict My College
        </Button>
      </form>
    </Card>
  )
}

