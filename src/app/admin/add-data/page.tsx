"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { IOption } from "@/types/GlobalTypes"
import { categories, courses, instituteTypes, quotas } from "@/utils/static"
import {
  autoComplete,
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
  closing_rankR1?: string
  closing_rankR2?: number
  closing_rankR3?: number
}
export default function AddDataPage() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })
  const [formData, setFormData] = useState<IFormData>()
  function onSubmit() {
    console.log("payload: ", formData)
  }
  return (
    <BELayout>
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
              rules={{
                required: true,
              }}
              errors={errors}
            />
            <Input
              name="closing_rankR1"
              label="Closing Rank (R1)"
              type="text"
              placeholder="Enter here"
              value={formData?.closing_rankR1}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
              }}
              errors={errors}
            />
            <Input
              name="closing_rankR2"
              label="Closing Rank (R2)"
              type="text"
              placeholder="Enter here"
              value={formData?.closing_rankR2}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: false,
              }}
              errors={errors}
            />
            <Input
              name="closing_rankR3"
              label="Closing Rank (R3)"
              type="text"
              placeholder="Enter here"
              value={formData?.closing_rankR3}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: false,
              }}
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
