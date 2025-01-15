"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { IOption } from "@/types/GlobalTypes"
import { categories, courses, states } from "@/utils/static"
import { onOptionSelected, onTextFieldChange } from "@/utils/utils"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"

interface IFormData {
  rank?: number | string
  state?: IOption
  courses?: IOption
}

export function CollegePredictorForm() {
  const [formData, setFormData] = useState<IFormData>({
    rank: "",
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  function onSubmit() {}

  function autoCompleteStates(
    text: string,
    setOptions: React.Dispatch<SetStateAction<IOption[]>>,
  ) {
    setOptions(
      states.filter((st) =>
        st?.text?.toLowerCase().includes(text.toLowerCase()),
      ),
    )
  }
  function autoCompleteCourses(
    text: string,
    setOptions: React.Dispatch<SetStateAction<IOption[]>>,
  ) {
    setOptions(
      courses.filter((st) =>
        st?.text?.toLowerCase().includes(text.toLowerCase()),
      ),
    )
  }

  function autoCompleteCategory(
    text: string,
    setOptions: React.Dispatch<SetStateAction<IOption[]>>,
  ) {
    setOptions(
      categories.filter((st) =>
        st?.text?.toLowerCase().includes(text.toLowerCase()),
      ),
    )
  }

  return (
    <Card className="tab:mx-16">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-medium">Enter Details</h3>

        <Input
          name="rank"
          label="Rank"
          type="number"
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
          placeholder="Search and Select"
          value={formData?.state}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={[]}
          debounceDelay={0}
          searchAPI={autoCompleteStates}
          errors={errors}
        />

        <SearchAndSelect
          name="courses"
          label="Course"
          placeholder="Search and Select"
          value={formData?.courses}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={[]}
          debounceDelay={0}
          searchAPI={autoCompleteCourses}
          errors={errors}
        />
        <SearchAndSelect
          name="category"
          label="Category"
          placeholder="Search and Select"
          value={formData?.courses}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={[]}
          debounceDelay={0}
          searchAPI={autoCompleteCategory}
          errors={errors}
        />

        <Button className="mt-6">Predict My College</Button>
      </form>
    </Card>
  )
}
