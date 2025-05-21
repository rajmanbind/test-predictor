"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { states } from "@/utils/static"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

interface IFormData {
  rank?: number | string
  state?: IOption
  courses?: IOption
}

export function CollegePredictorForm() {
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

  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const { fetchData } = useFetch()

  const { setAppState } = useAppState()

  const router = useRouter()

  useEffect(() => {
    getConfigData()
  }, [])

  async function getConfigData() {
    const res = await fetchData({
      url: "/api/admin/configure/get",
      params: { type: "COURSES" },
    })

    setCoursesList(res?.payload?.data || [])
  }

  function onSubmit() {
    setAppState({ pageLoader: true })

    const searchParams = new URLSearchParams()

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("state", formData?.state?.text || "")
    searchParams.set("course", formData?.courses?.text || "")

    router.push(`/results?${searchParams.toString()}`)
  }

  function disableCheck() {
    return (
      isEmpty(formData?.rank) ||
      isEmpty(formData?.state?.text) ||
      isEmpty(formData?.courses?.text)
    )
  }

  return (
    <Card className="mt-2 tab:mx-16 p-7 tab:p-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <h3 className="text-[25px] pc:text-4xl font-bold text-center">
            Predict Your College
          </h3>
          <p className="text-base text-gray-500 text-center poppinsFont">
            Enter your details to find the best college matches
          </p>
        </div>

        <Input
          name="rank"
          label="Rank"
          type="number"
          placeholder="Enter Rank"
          setValue={setValue}
          value={formData?.rank}
          onChange={(e) => onTextFieldChange(e, setFormData)}
          control={control}
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
          searchAPI={(text, setOptions) =>
            autoComplete(text, states, setOptions)
          }
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
          options={coursesList}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, coursesList, setOptions)
          }
          errors={errors}
        />

        <Button className="mt-6" onClick={onSubmit} disabled={disableCheck()}>
          Predict My College
        </Button>
      </form>
    </Card>
  )
}

