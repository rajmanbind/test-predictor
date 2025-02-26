"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { IOption } from "@/types/GlobalTypes"
import { categories, instituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import { Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider } from "../FeeRangeSlider"

interface IFormData {
  rank?: number | string
  state: IOption[]
  instituteType: IOption[]
  category?: IOption
  quota?: IOption[]
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
    instituteType: [],
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
      <MultiSelect
        name="instituteType"
        label="Institute Type"
        placeholder="Select Institute Type"
        value={formData?.instituteType}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={instituteTypes}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, instituteTypes, setOptions)
        }
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

      <MultiSelect
        name="quota"
        label="Quota"
        placeholder="Select Quota"
        value={formData?.quota}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={instituteTypes}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, instituteTypes, setOptions)
        }
        errors={errors}
      />

      <FeeRangeSlider />

      <Button
        className="mt-6 w-full flex items-center gap-2 justify-center"
        // onClick={onSubmit} disabled={disableCheck()}
      >
        <Settings2 />
        Apply Filters
      </Button>
    </form>
  )
}
