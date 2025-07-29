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
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const filteredStates = states.slice(1)

interface IFormData {
  instituteName?: string
  instituteType?: IOption
  state?: IOption
  courses?: IOption
  courseType?: IOption
  quotas?: IOption
  categories?: IOption
  fees?: number | string
  closingRankR1?: string
  closingRankR2?: string
  closingRankR3?: string
  strayRound?: string
  lastStrayRound?: string
  year?: IOption;
  counsellingType:IOption;
  counsellingTypeList:IOption;
  seatType:IOption;
  seatTypeList:IOption;
  categoryType:IOption;
  categoryTypeList:IOption;
}
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
  const [seatTypeList, setSeatTypeList] = useState<IOption[]>([])
  const [categoryTypeList, setSategoryTypeList] = useState<IOption[]>([])

  const params = useParams()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()

  useEffect(() => {
    if (editMode) {
      getDataById(params?.id)
    }

    getConfigData()
  }, [params?.id])

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

  async function getDataById(id: any) {
    const res = await fetchData({
      url: "/api/admin/get_data_by_id",
      params: {
        id,
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

    const r1 = data?.closingRankR1 + (data?.cRR1 ? `/ ${data.cRR1}` : "")
    const r2 = data?.closingRankR2
      ? data?.closingRankR2 + (data?.cRR2 ? `/ ${data.cRR2}` : "")
      : ""
    const r3 = data?.closingRankR3
      ? data?.closingRankR3 + (data?.cRR3 ? `/ ${data.cRR3}` : "")
      : ""
    const sr = data?.strayRound
      ? data?.strayRound + (data?.sRR ? `/ ${data.sRR}` : "")
      : ""
    const lsr = data?.lastStrayRound
      ? data?.lastStrayRound + (data?.lSRR ? `/ ${data.lSRR}` : "")
      : ""

    setFormData({
      instituteName: data?.instituteName,
      fees: data?.fees,
      closingRankR1: r1,
      closingRankR2: r2,
      closingRankR3: r3,
      strayRound: sr,
      lastStrayRound: lsr,
    })

    setDefaultValues(formatData)
  }

 async function fetchCounsellingTypes() {
  const res = await fetch("/api/counselling-types")
  const json = await res.json()
  return json.data
}

async function fetchSeatTypes(counsellingTypeId: string, stateId?: string) {
  const url = new URL("/api/seat-types", window.location.origin)
  url.searchParams.set("counselling_type_id", counsellingTypeId)
  if (stateId) url.searchParams.set("state_id", stateId)

  const res = await fetch(url.toString())
  const json = await res.json()
  return json.data
}

async function fetchCategoryTypes(seatTypeId: string) {
  const url = new URL("/api/category-types", window.location.origin)
  url.searchParams.set("seat_type_id", seatTypeId)

  const res = await fetch(url.toString())
  const json = await res.json()
  return json.data
}


useEffect(()=>{
    const loadSeatTypes = async () => {
    try {

      const data = await fetchSeatTypes(formData?.counsellingType?.id,formData?.state?.id);
      console.log("seat Data: ", data);
      setSeatTypeList(data||[]); // Assuming you want to store this data in state
    } catch (error) {
      console.error("Failed to load seat types:", error);
    }
  };
  if (formData?.counsellingType?.id || formData?.state?.id) {
    loadSeatTypes()
  }

},[formData?.counsellingType?.id,formData?.state?.id]);
useEffect(()=>{
    const loadCategorytTypes = async () => {
    try {

      const data = await fetchCategoryTypes(formData?.seatType?.id);
      console.log("Category Data: ", data);
      setSategoryTypeList(data||[]); // Assuming you want to store this data in state
    } catch (error) {
      console.error("Failed to load category types:", error);
    }
  };
if(formData?.seatType?.id)
  loadCategorytTypes();
},[formData?.seatType?.id]);

useEffect(() => {
  const loadCounsellingTypes = async () => {
    try {
      const data = await fetchCounsellingTypes();
      console.log("Counselling Data: ", data);
      setCounsellingList(data||[]); // Assuming you want to store this data in state
    } catch (error) {
      console.error("Failed to load counselling types:", error);
    }
  };

  loadCounsellingTypes();
}, []);
  async function onSubmit() {
    const payload = createPayload({
      instituteName: formData?.instituteName,
      instituteType: formData?.instituteType?.text,
      state: formData?.state?.text,
      course: formData?.courses?.text,
      courseType: formData?.courseType?.text,
      quota: formData?.quotas?.text,
      category: formData?.categories?.text,
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
      year: formData?.year?.text,
    })

    if (editMode) {
      const res = await fetchData({
        url: `/api/admin/update_data/${params?.id}`,
        method: "PUT",
        data: payload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)
      }
    } else {
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
      <div className="flex items-center gap-8 w-full mb-4">
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
  seatType: undefined,
  categoryType: undefined,
}))


  setSeatTypeList([])
  setSategoryTypeList([])
          }}
          control={control}
          setValue={setValue}
          required
          options={counsellingTypeList}
          debounceDelay={0}
          defaultOption={defaultValues?.counsellingTypeList}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, counsellingTypeList, setOptions)
          }
          errors={errors}
        />
{formData?.counsellingType?.id == 2 &&
       
        <SearchAndSelect
              name="state"
              label="State"
              placeholder="Search and Select"
              value={formData?.state}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
                setFormData((prev) => ({
  ...prev,
  state: selectedValue,
  seatType: undefined,
  categoryType: undefined,
}))


  setSeatTypeList([])
  setSategoryTypeList([])
              }}
              control={control}
              setValue={setValue}
              required
              options={filteredStates}
              debounceDelay={0}
              defaultOption={defaultValues?.state}
              searchAPI={(text, setOptions) =>
                autoComplete(text, filteredStates, setOptions)
              }
              errors={errors}
            /> }
          <SearchAndSelect
          name="seat Type"
          label="Seat Type"
          placeholder="Select Seat Type"
          value={formData?.seatType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
           setFormData((prev) => ({
  ...prev,
  seatType: selectedValue,
  categoryType: null,
}))


  setSategoryTypeList([])


    // Load category immediately based on selectedValue.id
  // fetchCategoryTypes(selectedValue.id)
  //   .then(data=>{

  //     setSategoryTypeList(data & data?.length?data:[])

  //   })
  //   .catch((err) => console.error("Category fetch failed:", err))

          }}
          control={control}
          setValue={setValue}
           disabled={!formData?.counsellingType?.id || seatTypeList?.length === 0}
          required
          options={seatTypeList}
          debounceDelay={0}
          defaultOption={defaultValues?.seatTypeList}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, seatTypeList, setOptions)
          }
          errors={errors}
        />
    
          <SearchAndSelect
          name="category Type"
          label="Category Type"
          placeholder="Select Category Type"
          value={formData?.categoryType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          required
          options={categoryTypeList}
          debounceDelay={0}
          defaultOption={defaultValues?.categoryTypeList}
          disabled={!formData?.seatType?.id || categoryTypeList.length === 0}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, categoryTypeList, setOptions)
          }
          errors={errors}
        />
    

     
      </div>
      <div className="flex items-center gap-8 w-full">
      
        <SearchAndSelect
          name="year"
          label="Year"
          value={formData?.year}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          required
          setValue={setValue}
          options={years()}
          debounceDelay={0}
          defaultOption={
            editMode
              ? defaultValues?.year
              : { id: 0, text: String(new Date().getFullYear() - 1) }
          }
          searchAPI={(text, setOptions) =>
            autoComplete(text, years(), setOptions)
          }
          wrapperClass="max-w-[395px]"
          errors={errors}
        />

        <SearchAndSelect
          name="courseType"
          label="Course Type"
          placeholder="Search and Select"
          value={formData?.courseType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
            getCoursesData(selectedValue?.id)
          }}
          control={control}
          setValue={setValue}
          required
          options={courseType}
          debounceDelay={0}
          defaultOption={defaultValues?.courseType}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, courseType, setOptions)
          }
          errors={errors}
        />
      </div>

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
            <SearchAndSelect
              name="state"
              label="State"
              placeholder="Search and Select"
              value={formData?.state}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={filteredStates}
              debounceDelay={0}
              defaultOption={defaultValues?.state}
              searchAPI={(text, setOptions) =>
                autoComplete(text, filteredStates, setOptions)
              }
              errors={errors}
            />
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

            <SearchAndSelect
              name="quotas"
              label="Quota"
              placeholder="Search and Select"
              value={formData?.quotas}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              required
              setValue={setValue}
              options={quotasList}
              debounceDelay={0}
              defaultOption={defaultValues?.quotas}
              searchAPI={(text, setOptions) =>
                autoComplete(text, quotasList, setOptions)
              }
              errors={errors}
            />
            <SearchAndSelect
              name="categories"
              label="Category"
              placeholder="Search and Select"
              value={formData?.categories}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              required
              setValue={setValue}
              options={categoriesList}
              debounceDelay={0}
              defaultOption={defaultValues?.categories}
              searchAPI={(text, setOptions) =>
                autoComplete(text, categoriesList, setOptions)
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
            <Input
              name="closingRankR1"
              label="Closing Rank (R1)"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.closingRankR1}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
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
          </ResponsiveGrid>

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

