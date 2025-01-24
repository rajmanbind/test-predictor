"use client"

// Add this at the top of the file
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import { FE_Layout } from "@/components/frontend/FE_Layout"
import { ThemeSwitcher } from "@/components/frontend/ThemeSwitcher"
import { onTextFieldChange } from "@/utils/utils"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

export default function LoginCard() {
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

  function onSubmit() {}

  return (
    <FE_Layout>
      <div className={`flex justify-center items-center min-h-screen`}>
        <Card className="tab:mx-18">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-color-text  ml-8">
              Admin Login
            </h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              name="password"
              label="Password"
              type="password"
              placeholder="Enter Rank"
              value={formData?.password}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <Button className="mt-6 mt-3" type="submit">
              Login
            </Button>
          </form>
        </Card>
      </div>
    </FE_Layout>
  )
}
