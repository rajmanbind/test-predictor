"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import { IOption } from "@/types/GlobalTypes"
import { instituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import React, { SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"
import { IFormData, IParams } from "./Filter"

const filterStates = states.slice(1)

interface IFilterPopupProps {
  isOpen: boolean

  setMobFilterFormData: React.Dispatch<SetStateAction<IFormData>>
  mobFilterFormData: IFormData

  setFilterParams: React.Dispatch<SetStateAction<any>>
  categoryList: IOption[]
  quotasList: IOption[]

  onConfirm: () => void
  onClose: () => void
}

export function FilterPopup({
  isOpen,
  categoryList,
  quotasList,
  setFilterParams,
  setMobFilterFormData,
  mobFilterFormData,
  onConfirm,
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

    includeInParams(mobFilterFormData?.state, "states", params)
    includeInParams(mobFilterFormData?.instituteType, "instituteType", params)
    includeInParams(mobFilterFormData?.category, "category", params)
    includeInParams(mobFilterFormData?.quota, "quota", params)

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
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="200px"
      popupClass="w-[350px] tab:w-[700px]"
    >
      <div className="bg-color-form-background py-12 grid place-items-center">
        <form
          className={cn("flex flex-col gap-4 w-full px-6")}
          onSubmit={handleSubmit(onSubmit)}
        >
          <MultiSelect
            name="instituteType"
            label="Institute Type"
            placeholder="Select Institute Type"
            value={mobFilterFormData?.instituteType}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={instituteTypes}
            defaultOption={mobFilterFormData?.instituteType}
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
            value={mobFilterFormData?.state}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={filterStates}
            debounceDelay={0}
            defaultOption={mobFilterFormData?.state}
            searchAPI={(text, setOptions) =>
              autoComplete(text, filterStates, setOptions)
            }
            errors={errors}
          />

          <MultiSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            value={mobFilterFormData?.category}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={categoryList}
            debounceDelay={0}
            defaultOption={mobFilterFormData?.category}
            searchAPI={(text, setOptions) =>
              autoComplete(text, categoryList, setOptions)
            }
            errors={errors}
          />

          <MultiSelect
            name="quota"
            label="Quota"
            placeholder="Select Quota"
            value={mobFilterFormData?.quota}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={quotasList}
            debounceDelay={0}
            defaultOption={mobFilterFormData?.quota}
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
            className="mt-2"
            type="submit"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Apply Filters
          </Button>
        </form>
      </div>
    </AnimatedPopup>
  )
}

