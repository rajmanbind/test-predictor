"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import { IOption } from "@/types/GlobalTypes"
import { instituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import { Settings2 } from "lucide-react"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"

const filterStates = states.slice(1)

export interface IFormData {
  state: IOption[]
  instituteType: IOption[]
  category: IOption[]
  quota: IOption[]
}

export interface IParams {
  feeFrom?: number
  feeTo?: number
  states?: any
  category?: any
  instituteType?: any
  quota?: any
}

export function Filter({
  className,
  categoryList,
  quotasList,
  setFilterParams,
}: {
  className?: string
  categoryList: IOption[]
  quotasList: IOption[]
  setFilterParams: React.Dispatch<SetStateAction<any>>
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
    state: [],
    instituteType: [],
    category: [],
    quota: [],
  })

  const [range, setRange] = useState<[number, number]>([0, MAX_FEE])
  const [includeFeeRange, setIncludeFeeRange] = useState(false)

  async function onSubmit() {
    let params: IParams = {}

    if (includeFeeRange) {
      params = {
        feeFrom: range[0],
        feeTo: range[1],
      }
    }

    includeInParams(formData?.state, "states", params)
    includeInParams(formData?.instituteType, "instituteType", params)
    includeInParams(formData?.category, "category", params)
    includeInParams(formData?.quota, "quota", params)

    setFilterParams(params)
  }

  function includeInParams(
    array: IOption[],
    key: "states" | "category" | "instituteType" | "quota",
    params: IParams,
  ) {
    if (array?.length > 0) {
      params[key] = array.map((item) => item.text).join(",")
    }
  }

  return (
    <form
      className={cn(
        "flex flex-col gap-4 border border-color-border p-4 rounded-md",
        className,
      )}
      onSubmit={handleSubmit(onSubmit)}
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
        options={filterStates}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, filterStates, setOptions)
        }
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

      <FeeRangeSlider
        range={range}
        setRange={setRange}
        includeFeeRange={includeFeeRange}
        setIncludeFeeRange={setIncludeFeeRange}
      />

      <Button
        type="submit"
        className="mt-4 w-full flex items-center gap-2 justify-center"
      >
        <Settings2 />
        Apply Filters
      </Button>
    </form>
  )
}
