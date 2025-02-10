"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import { onTextFieldChange } from "@/utils/utils"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function AddDataPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  return (
    <BELayout>
      <Heading>Add Data</Heading>
      <Card>
        <ResponsiveGrid className="p-2 py-3">
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="Enter Rank"
            value={formData?.username}
            onChange={(e) => onTextFieldChange(e, setFormData)}
            control={control}
            rules={{
              required: true,
            }}
            errors={errors}
          />
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="Enter Rank"
            value={formData?.username}
            onChange={(e) => onTextFieldChange(e, setFormData)}
            control={control}
            rules={{
              required: true,
            }}
            errors={errors}
          />
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="Enter Rank"
            value={formData?.username}
            onChange={(e) => onTextFieldChange(e, setFormData)}
            control={control}
            rules={{
              required: true,
            }}
            errors={errors}
          />
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="Enter Rank"
            value={formData?.username}
            onChange={(e) => onTextFieldChange(e, setFormData)}
            control={control}
            rules={{
              required: true,
            }}
            errors={errors}
          />
        </ResponsiveGrid>
      </Card>
    </BELayout>
  )
}
