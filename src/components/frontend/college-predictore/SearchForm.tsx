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

export function SearchForm() {
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
    <form
      className="grid grid-cols-[repeat(auto-fill,minmax(0,1fr))] tab:grid-cols-[repeat(3,minmax(0,1fr))] pc:grid-cols-[repeat(4,minmax(0,1fr))_160px] gap-4 tab:gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="rank"
        label="Rank"
        type="number"
        placeholder="Enter Rank"
        value={formData?.rank}
        onChange={(e) => onTextFieldChange(e, setFormData)}
        control={control}
        setValue={setValue}
        rules={{
          required: false,
        }}
        errors={errors}
      />

      <SearchAndSelect
        name="state"
        label="State"
        placeholder="Select State"
        value={formData?.state}
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
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
      <Button
        className="h-[50px] tab:mt-auto"
        onClick={onSubmit}
        disabled={disableCheck()}
      >
        Search
      </Button>
    </form>
  )
}
