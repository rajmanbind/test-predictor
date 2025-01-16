import { cn } from "@/utils/utils"
import { Eye, EyeClosed, Info } from "lucide-react"
import * as React from "react"
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form"

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "name"> {
  name: string
  label?: string
  labelHint?: React.ReactNode
  labelTooltipIcon?: React.ReactNode
  value: string | number | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FieldErrors<FieldValues>
  control: Control<any>
  defaultValue?: string
  type?: string
  rules?: RegisterOptions
  forceRequired?: boolean
  wrapperClass?: string
  boxWrapperClass?: string
  errorClass?: string
  labelClass?: string
  labelContainerClass?: string
}

export function Input({
  className,
  errors,
  label,
  labelHint,
  labelTooltipIcon,
  placeholder = "Enter here",
  name,
  type,
  control,
  defaultValue,
  rules,
  onChange,
  wrapperClass,
  errorClass,
  labelClass,
  boxWrapperClass,
  labelContainerClass,
  ...props
}: InputProps) {
  const [passType, setPassType] = React.useState("password")

  function isRequired() {
    return (rules?.required && !props?.disabled) || props?.forceRequired
      ? "*"
      : ""
  }

  function handleError() {
    let errorMsg

    const error = errors?.[name] as FieldError | undefined
    errorMsg = error?.message ? error?.message : "Validation failed!"

    if (error?.type === "required") {
      errorMsg = error?.message ? error?.message : `${label} is required!`
    } else if (error?.type === "pattern") {
      errorMsg = error?.message ? error?.message : `${label} is not valid!`
    }

    return { error, errorMsg }
  }

  function isRulesRequired() {
    if (props?.forceRequired) {
      return { required: true }
    }

    return props?.disabled ? { required: false } : rules
  }

  const { error, errorMsg } = handleError()

  return (
    <Controller
      name={name}
      control={control}
      rules={isRulesRequired()}
      render={({ field }) => {
        if (!field?.value && field?.value !== "" && defaultValue) {
          field.onChange(defaultValue)
          const value = { target: { value: defaultValue }, name }

          // @ts-ignore
          onChange(value)
        }

        if (props?.value === "EMPTY" && field?.value) {
          field.onChange("")
        }

        return (
          <div className={cn("text-color-text", wrapperClass)}>
            {label && (
              <div
                className={cn("flex items-baseline gap-2", labelContainerClass)}
              >
                <label
                  className={cn(
                    "text-[16px] xl:text-[18px] mb-[6px] block font-semibold",
                    labelClass,
                  )}
                  htmlFor={props?.id}
                >
                  {isRequired() + label}
                </label>

                {labelHint}
                {labelTooltipIcon}
              </div>
            )}

            <div
              className={cn(
                "relative flex justify-between items-center gap-2 w-full",
                "componentsBox",
                error && "border-red-600",
                props?.disabled
                  ? "bg-[#DCE5DD] border border-[#CCCCCC] cursor-not-allowed"
                  : "",
                boxWrapperClass,
              )}
            >
              <input
                name={name}
                type={type === "password" ? passType : type || "text"}
                className={cn(
                  "flex focus:outline-none focus-visible:outline-none disabled:bg-[#DCE5DD] disabled:cursor-not-allowed",
                  "bg-color-white_black w-full text-sm font-[400] text-[14px]",
                  className,
                  props?.readOnly && "cursor-not-allowed",
                )}
                ref={field.ref}
                placeholder={placeholder}
                readOnly={props?.readOnly}
                onChange={(e) => {
                  onChange(e)
                  if (e?.target?.value.trim() === "") {
                    field?.onChange("")
                    return
                  }
                  field?.onChange(e?.target?.value)
                }}
                autoComplete="on"
                {...props}
                value={field?.value}
              />

              {type === "password" && passType === "password" && (
                <EyeClosed
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => setPassType("text")}
                />
              )}

              {type === "password" && passType === "text" && (
                <Eye
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => setPassType("password")}
                />
              )}

              {error && <Info className="flex-shrink-0 text-red-600" />}
            </div>
            {error && (
              <p
                className={cn(
                  "text-sm mt-1 text-red-600 font-normal",
                  errorClass,
                )}
              >
                {errorMsg}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
