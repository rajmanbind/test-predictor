"use client"

import { Button } from "@/components/common/Button"
import { Input } from "@/components/common/Input"
import MultiSelect from "@/components/common/MultiSelect"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { IOption } from "@/types/GlobalTypes"
import { categories, courses, states } from "@/utils/static"
import {
  autoComplete,
  cn,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider } from "../FeeRangeSlider"

interface IFormData {
  rank?: number | string
  state: IOption[]
  courses?: IOption
  category?: IOption
}

export function Filter({ className }: { className?: string }) {
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
    state: [],
  })

  const router = useRouter()

  // function onSubmit() {
  //   const searchParams = new URLSearchParams()

  //   searchParams.set("rank", formData?.rank?.toString() || "")
  //   searchParams.set("state", formData?.state?.text || "")
  //   searchParams.set("courses", formData?.courses?.text || "")
  //   searchParams.set("category", formData?.category?.text || "")

  //   router.push(`/results?${searchParams.toString()}`)
  // }

  // function disableCheck() {
  //   return (
  //     isEmpty(formData?.rank) ||
  //     isEmpty(formData?.state?.text) ||
  //     isEmpty(formData?.courses?.text) ||
  //     isEmpty(formData?.category?.text)
  //   )
  // }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      // onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="rank"
        label="Rank"
        type="number"
        placeholder="Enter Rank"
        value={formData?.rank}
        onChange={(e) => onTextFieldChange(e, setFormData)}
        control={control}
        rules={{
          required: false,
        }}
        errors={errors}
      />

      <MultiSelect
        name="state"
        label="State"
        placeholder="Select State"
        value={formData?.state}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={states}
        debounceDelay={0}
        searchAPI={(text, setOptions) => autoComplete(text, states, setOptions)}
        errors={errors}
      />

      <SearchAndSelect
        name="courses"
        label="Course"
        placeholder="Select Course"
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
        placeholder="Select Category"
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

      <FeeRangeSlider />

      <Button
        className="mt-2"
        // onClick={onSubmit} disabled={disableCheck()}
      >
        Apply Filters
      </Button>
    </form>
  )
}
