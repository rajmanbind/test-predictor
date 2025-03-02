"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import { IOption } from "@/types/GlobalTypes"
import { instituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import { Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"

interface IFormData {
  rank?: number | string
  state: IOption[]
  instituteType: IOption[]
  category?: IOption[]
  quota?: IOption[]
}

export function Filter({
  className,
  categoryList,
  quotasList,
}: {
  className?: string
  categoryList: IOption[]
  quotasList: IOption[]
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
    state: [],
    instituteType: [],
    category: [],
  })

  const [range, setRange] = useState<[number, number]>([0, MAX_FEE])

  const router = useRouter()

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

      <MultiSelect
        name="category"
        label="Category"
        placeholder="Select Category"
        value={formData?.category}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={categoryList}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, categoryList, setOptions)
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
        options={quotasList}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, quotasList, setOptions)
        }
        errors={errors}
      />

      <FeeRangeSlider range={range} setRange={setRange} />

      <Button
        className="mt-4 w-full flex items-center gap-2 justify-center"
        // onClick={onSubmit} disabled={disableCheck()}
      >
        <Settings2 />
        Apply Filters
      </Button>
    </form>
  )
}
