"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { IOption } from "@/types/GlobalTypes"
import { categories, courses, states } from "@/utils/static"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface IFormData {
  rank?: number | string
  state?: IOption
  courses?: IOption
  category?: IOption
}

export function CollegePredictorForm() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>({
    rank: "",
  })

  const router = useRouter()

  function onSubmit() {
    const searchParams = new URLSearchParams()

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("state", formData?.state?.text || "")
    searchParams.set("courses", formData?.courses?.text || "")
    searchParams.set("category", formData?.category?.text || "")

    router.push(`/results?${searchParams.toString()}`)
  }

  function disableCheck() {
    return (
      isEmpty(formData?.rank) ||
      isEmpty(formData?.state?.text) ||
      isEmpty(formData?.courses?.text) ||
      isEmpty(formData?.category?.text)
    )
  }

  return (
    <Card className="tab:mx-16">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-medium">Enter Details</h3>

        <Input
          name="rank"
          label="Rank"
          type="number"
          value={formData?.rank}
          onChange={(e) => onTextFieldChange(e, setFormData)}
          control={control}
          rules={{
            required: false,
          }}
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
          options={states}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, states, setOptions)
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
          setValue={setValue}
          options={courses}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, courses, setOptions)
          }
          errors={errors}
        />
        <SearchAndSelect
          name="category"
          label="Category"
          placeholder="Search and Select"
          value={formData?.category}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={categories}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, categories, setOptions)
          }
          errors={errors}
        />

        <Button className="mt-6" onClick={onSubmit} disabled={disableCheck()}>
          Predict My College
        </Button>
      </form>
    </Card>
  )
}
