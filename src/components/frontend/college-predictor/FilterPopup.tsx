"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import { IOption } from "@/types/GlobalTypes"
import { categories, instituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"

interface IFilterPopupProps {
  isOpen: boolean

  onConfirm: () => void
  onCancel?: () => void
  onClose: () => void
}

interface IFormData {
  rank?: number | string
  state: IOption[]
  instituteType: IOption[]
  category?: IOption
  quota?: IOption[]
}

export function FilterPopup({
  isOpen,
  onConfirm,
  onCancel,
  onClose,
}: IFilterPopupProps) {
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

  const [range, setRange] = useState<[number, number]>([0, MAX_FEE])

  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="200px"
      popupClass="w-[350px] tab:w-[700px]"
    >
      <div className="bg-color-form-background py-12 grid place-items-center">
        <form
          className={cn("flex flex-col gap-4")}
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
            searchAPI={(text, setOptions) =>
              autoComplete(text, states, setOptions)
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

          <FeeRangeSlider range={range} setRange={setRange} />

          <Button
            className="mt-2"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            // onClick={onSubmit} disabled={disableCheck()}
          >
            Apply Filters
          </Button>
        </form>
      </div>
    </AnimatedPopup>
  )
}
