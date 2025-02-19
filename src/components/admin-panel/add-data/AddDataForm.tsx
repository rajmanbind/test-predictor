"use client"

import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { instituteTypes, years } from "@/utils/static"
import {
  autoComplete,
  clearReactHookFormValueAndStates,
  createPayload,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface IFormData {
  instituteName?: string
  instituteType?: IOption
  courses?: IOption
  quotas?: IOption
  categories?: IOption
  fees?: number | string
  closingRankR1?: string
  closingRankR2?: number
  closingRankR3?: number
  strayRound?: number
  year?: IOption
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

  const params = useParams()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()
  const router = useRouter()

  useEffect(() => {
    if (editMode) getDataById(params?.id)

    getConfigData()
  }, [params?.id])

  async function getConfigData() {
    const [quotaData, categoryData, coursesData] = await Promise.all([
      fetchData({ url: "/api/admin/configure/get", params: { type: "QUOTA" } }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CATEGORY" },
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "COURSES" },
      }),
    ])

    setQuotasList(quotaData?.payload?.data || [])
    setCategoriesList(categoryData?.payload?.data || [])
    setCoursesList(coursesData?.payload?.data || [])
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
      courses: {
        text: data?.course,
        id: data?.course,
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
        text: data?.year,
        id: data?.year,
      },
    }

    setFormData({
      instituteName: data?.instituteName,
      fees: data?.fees,
      closingRankR1: data?.closingRankR1,
      closingRankR2: data?.closingRankR2,
      closingRankR3: data?.closingRankR3,
      strayRound: data?.strayRound,
    })

    setDefaultValues(formatData)
  }

  async function onSubmit() {
    const payload = createPayload({
      instituteName: formData?.instituteName,
      instituteType: formData?.instituteType?.text,
      course: formData?.courses?.text,
      quota: formData?.quotas?.text,
      category: formData?.categories?.text,
      fees: formData?.fees,
      closingRankR1: formData?.closingRankR1,
      closingRankR2: formData?.closingRankR2,
      closingRankR3: formData?.closingRankR3,
      strayRound: formData?.strayRound,
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
        router.replace("/admin/manage-data")
      }
    } else {
      const res = await fetchData({
        url: "/api/admin/add_data",
        method: "POST",
        data: payload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)

        clearReactHookFormValueAndStates(
          [
            "instituteName",
            "instituteType",
            "courses",
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
    }
  }

  return (
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
            type="number"
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
            type="number"
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
            type="number"
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
            type="number"
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
            type="number"
            placeholder="Enter here"
            value={formData?.strayRound}
            setValue={setValue}
            onChange={(e) => onTextFieldChange(e, setFormData)}
            control={control}
            errors={errors}
          />

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
                : { id: 0, text: String(new Date().getFullYear()) }
            }
            searchAPI={(text, setOptions) =>
              autoComplete(text, years(), setOptions)
            }
            errors={errors}
          />
        </ResponsiveGrid>
        <Button className="mt-6 ml-auto px-6" type="submit">
          {editMode ? "Update Data" : "Save Data"}
        </Button>
      </form>
    </Card>
  )
}
