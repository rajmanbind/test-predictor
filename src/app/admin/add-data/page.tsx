"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { showToast } from "@/components/common/ToastProvider"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  categories,
  courses,
  instituteTypes,
  quotas,
  years,
} from "@/utils/static"
import {
  autoComplete,
  clearReactHookFormValueAndStates,
  createPayload,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useState } from "react"
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
export default function AddDataPage() {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })
  const [formData, setFormData] = useState<IFormData>()

  const { fetchData } = useFetch()

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

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Add Data</Heading>

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
              searchAPI={(text, setOptions) =>
                autoComplete(text, courses, setOptions)
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
              options={courses}
              debounceDelay={0}
              searchAPI={(text, setOptions) =>
                autoComplete(text, courses, setOptions)
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
              options={quotas}
              debounceDelay={0}
              searchAPI={(text, setOptions) =>
                autoComplete(text, courses, setOptions)
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
              options={categories}
              debounceDelay={0}
              searchAPI={(text, setOptions) =>
                autoComplete(text, courses, setOptions)
              }
              errors={errors}
            />
            <Input
              name="fees"
              label="Fees"
              type="number"
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
              defaultOption={{ id: 0, text: String(new Date().getFullYear()) }}
              searchAPI={(text, setOptions) =>
                autoComplete(text, courses, setOptions)
              }
              errors={errors}
            />
          </ResponsiveGrid>
          <Button className="mt-6 ml-auto w-28" type="submit">
            Save
          </Button>
        </form>
      </Card>
    </BELayout>
  )
}
