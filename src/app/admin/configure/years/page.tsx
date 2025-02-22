"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { configYearOptions } from "@/utils/static"
import { autoComplete } from "@/utils/utils"
import { Info, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const CONFIG_TYPE = "CONFIG_YEAR"

export default function ConfigureYearPage() {
  const [selectedYear, setSelectedYear] = useState<IOption | undefined>()
  const [defaultValue, setDefaultValue] = useState<IOption | undefined>()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  const router = useRouter()

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const res = await fetchData({
      url: "/api/admin/configure/get",
      params: { type: CONFIG_TYPE },
    })
    if (res?.success) {
      setDefaultValue({
        id: res?.payload?.data?.[0]?.id,
        text: res?.payload?.data?.[0]?.text,
      })
    }
  }

  async function onSubmit() {
    const res = await fetchData({
      url: "/api/admin/configure/update_config_year",
      method: "POST",
      data: {
        type: CONFIG_TYPE,
        text: selectedYear?.text,
      },
    })
    if (res?.success) {
      showToast("success", res?.payload?.msg)
      router.push("/admin/manage-data")
    }
  }

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Year</Heading>

      <Card className="mt-4 px-6 py-10 flex flex-col tab:flex-row items-start gap-8 w-fit">
        <form className="w-full max-w-96" onSubmit={handleSubmit(onSubmit)}>
          <SearchAndSelect
            name="configYear"
            label="Select Year To Show Data System wide"
            placeholder="Select Dropdown Type"
            value={selectedYear}
            defaultOption={defaultValue}
            onChange={({ selectedValue }) => {
              setSelectedYear(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={configYearOptions()}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, configYearOptions(), setOptions)
            }
            errors={errors}
          />

          <div className="flex mt-8 items-center justify-end">
            <Button
              className="py-2"
              type="submit"
              disabled={defaultValue?.text === selectedYear?.text}
            >
              Save Changes
            </Button>
          </div>
        </form>

        <div className="flex gap-2 text-color-text text-base font-light tracking-[1px] text-justify w-full max-w-[500px]">
          <Info
            className="text-blue-600 flex-shrink-0 translate-y-[2px]"
            size={20}
          />

          <p className="text-xs tab:text-sm pc:text-base leading-relaxed">
            This Selected Year will be used to display data in system. For eg:
            In Table Columns where we have cr1, cr2, cr3 etc. will reflect years
            data from here. suppose u have selected 2023 - 2024 then in Table it
            will show: CR 2023 [R1], CR 2024 [R1], CR 2023 [R2], CR 2024 [R2]
            and so on.
          </p>
        </div>
      </Card>
    </BELayout>
  )
}
