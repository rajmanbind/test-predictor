"use client"

import { Button } from "@/components/common/Button"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { states } from "@/utils/static"
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
  course?: IOption
  category?: IOption
}

export function SearchForm({
  categoriesList,
  coursesList,
}: {
  categoriesList: IOption[]
  coursesList: IOption[]
}) {
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

  const { getSearchParams, setSearchParams } = useInternalSearchParams()

  const router = useRouter()

  function onSubmit() {
    const searchParams = new URLSearchParams()

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("state", formData?.state?.text || "")
    searchParams.set("course", formData?.course?.text || "")
    searchParams.set("category", formData?.category?.text || "")

    router.push(`/results?${searchParams.toString()}`)
  }

  return (
    <form
      className="grid grid-cols-[repeat(1,minmax(0,1fr))] tab:grid-cols-[repeat(3,minmax(0,1fr))] pc:grid-cols-[repeat(4,minmax(0,1fr))_160px] gap-4 tab:gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="rank"
        label="Rank"
        type="number"
        placeholder="Enter Rank"
        value={formData?.rank || getSearchParams("rank") || ""}
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
        defaultOption={
          getSearchParams("state")
            ? { id: 0, text: getSearchParams("state") }
            : undefined
        }
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
        name="course"
        label="Course"
        placeholder="Select Course"
        value={formData?.course}
        defaultOption={
          getSearchParams("course")
            ? { id: 0, text: getSearchParams("course") }
            : undefined
        }
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
      />
      <SearchAndSelect
        name="category"
        label="Category"
        placeholder="Select Category"
        value={formData?.category}
        defaultOption={
          getSearchParams("category")
            ? { id: 0, text: getSearchParams("category") }
            : undefined
        }
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={categoriesList}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, categoriesList, setOptions)
        }
        errors={errors}
      />
      <Button className="h-[50px] mt-3 tab:mt-auto" onClick={onSubmit}>
        Search
      </Button>
    </form>
  )
}
