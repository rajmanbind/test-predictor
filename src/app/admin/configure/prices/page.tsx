"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  cn,
  isEmpty,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

const dropDownType: IOption[] = [
  { id: "College Cutoff - UG", text: "W College Cutoff - UG" },
  { id: "College Cutoff - PG", text: "W College Cutoff - PG" },
  { id: "College Cutoff - MDS", text: "W College Cutoff - MDS" },
  { id: "College Cutoff - SS", text: "W College Cutoff - PG" },
  { id: "College Cutoff - DNB", text: "W College Cutoff - DNB" },
  { id: "College Cutoff - INICET", text: "W College Cutoff - INICET" },
  { id: "College Predictor", text: "College Predictor" },
  {
    id: "Single College Closing Rank - UG",
    text: "Single College Closing Rank - UG",
  },
  {
    id: "Single College Closing Rank - PG",
    text: "Single College Closing Rank - PG",
  },
  {
    id: "Single College Closing Rank - MDS",
    text: "Single College Closing Rank - MDS",
  },
  {
    id: "Single College Closing Rank - SS",
    text: "Single College Closing Rank - SS",
  },
  {
    id: "Single College Closing Rank - DNB",
    text: "Single College Closing Rank - DNB",
  },
  {
    id: "Single College Closing Rank - INICET",
    text: "Single College Closing Rank - INICET",
  },
  { id: "State Closing Rank - UG", text: "State Closing Rank - UG" },
  { id: "State Closing Rank - PG", text: "State Closing Rank - PG" },
  { id: "State Closing Rank - MDS", text: "State Closing Rank - MDS" },
  { id: "All India Closing Rank - DNB", text: "All India Closing Rank - DNB" },
  { id: "All India Closing Rank - INICET", text: "All India Closing Rank - INICET" },
  { id: "All India Closing Rank - SS", text: "All India Closing Rank - SS" },
  { id: "Packages", text: "Packages" },
]

export default function ConfigurePricesPage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<IOption | undefined>()

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  const [updateMode, setUpdateMode] = useState<string>("")
  const { appState } = useAppState()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (selectedType) getData(selectedType.id)
  }, [selectedType])

  async function getData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure_prices/get",
      params: { type },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text } : item)),
    )
  }

  async function updateData(id: number, price: string) {
    if (!String(price)?.trim()) return

    const res = await fetchData({
      url: "/api/admin/configure_prices/update",
      method: "POST",
      data: { id, price: Number(price.trim()) },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(selectedType!.id)
    }
  }

  const isSaveDisabled =
    configList?.length === 0 ||
    configList?.some(({ price }) => String(price)?.trim() === "") ||
    JSON.stringify(configList) === JSON.stringify(initialConfigList)

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Prices</Heading>

      <Card className="mt-4 p-6 min-h-[400px]">
        <div className="w-full max-w-96">
          <SearchAndSelect
            name="dropDownType"
            label="Select Option"
            placeholder="Select Option"
            value={selectedType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, () => {})
              setSelectedType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={dropDownType}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, dropDownType, setOptions)
            }
            errors={errors}
          />
        </div>

        {shouldRenderComponent([selectedType], "AND") && (
          <form className="w-full">
            <div className="text-xl text-color-text mt-8 mb-4">
              {selectedType?.text} Price
            </div>

            {shouldRenderComponent(
              [isEmpty(configList), !appState.isLoading],
              "AND",
            ) && (
              <div className="text-color-subtext text-center mt-10 mb-2 w-full border border-color-border py-10">
                No options to show
              </div>
            )}

            <ul
              ref={listRef}
              className="flex flex-col gap-6 w-full max-w-[400px] max-h-[calc(100vh-500px)] overflow-y-auto"
            >
              {configList?.map(({ id, item, price }, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[1fr_100px] items-center text-color-subtext py-2 mr-4 text-sm border-t border-b border-color-border"
                >
                  <div>{item}</div>

                  <Input
                    name={String(index)}
                    placeholder="Enter here"
                    value={price}
                    type="number"
                    setValue={setValue}
                    onChange={(e) => {
                      updateText(index, e.target.value)
                    }}
                    onFocus={(e) => {
                      if (id) {
                        setUpdateMode(e.target.name)
                      }
                    }}
                    onBlur={(e) => {
                      if (id) {
                        setUpdateMode("")
                        if (item !== initialConfigList?.[index]?.price)
                          updateData(id, e.target.value)

                        if (e.target.value.trim() === "") {
                          setValue(
                            String(index),
                            initialConfigList?.[index]?.price,
                          )
                          updateData(id, e.target.value)
                        }
                      }
                    }}
                    control={control}
                    errors={errors}
                    boxWrapperClass="h-[40px]"
                    wrapperClass={cn(
                      "w-full",
                      String(index) === updateMode && "z-[1001]",
                    )}
                  />
                </li>
              ))}
            </ul>

            <div className="flex mt-8 items-center justify-end mb-8">
              <Button className="py-2" type="submit" disabled={isSaveDisabled}>
                Update Changes
              </Button>
            </div>
          </form>
        )}
      </Card>

      {updateMode && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-[1000]"></div>
      )}

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}

