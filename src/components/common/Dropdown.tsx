import useOutsideClick from "@/hooks/useOutsideClick"
import { ICommonComponentProps, IOption } from "@/types/GlobalTypes"
import { cn, isEmpty } from "@/utils/utils"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, FieldError } from "react-hook-form"

interface IDropdownProps extends ICommonComponentProps {
  value: IOption | undefined | null
  options: IOption[]
  onChange: (name: string, selectedValue: IOption) => void
  listClass?: string
  listOptionClass?: string
  selectedOptionClass?: string
  displayIdToo?: boolean
  forceRequired?: boolean
}

export function Dropdown({
  name,
  label,
  labelHint,
  labelTooltipIcon,
  placeholder = "Select here",
  value,
  options,
  onChange,
  required,
  errors,
  control,
  defaultOption,
  setValue,
  selectedOptionClass,
  ...props
}: IDropdownProps) {
  const [optionListOpen, setOptionListOpen] = useState(false)
  const [initalLoadCompleted, setInitalLoadCompleted] = useState(false)

  const internalRef = useRef(null)

  useOutsideClick(internalRef, () => setOptionListOpen(false))

  useEffect(() => {
    if (!isEmpty(defaultOption?.text)) {
      setValue(name, defaultOption)
    }
  }, [defaultOption])

  useEffect(() => {
    setInitalLoadCompleted(true)
  }, [])

  function isRequired() {
    return required ? "*" : ""
  }

  const error = errors?.[name] as FieldError | undefined

  function isRulesRequired() {
    if (props?.forceRequired) {
      return true
    }

    return props?.disabled ? false : required
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRulesRequired() }}
      render={({ field }) => {
        // if (!field?.value && defaultOption) {
        //   field.onChange(defaultOption)
        // }

        if (
          value?.text === "EMPTY" &&
          field?.value?.text &&
          initalLoadCompleted
        ) {
          field.onChange(null)
        }

        return (
          <div className={cn("text-color-text", props?.wrapperClass)}>
            {label && (
              <div className="flex items-baseline gap-2">
                <label className="text-[16px] xl:text-[18px] mb-[6px] font-semibold block">
                  {isRequired() + label}
                </label>

                {labelHint}
                {labelTooltipIcon}
              </div>
            )}

            <div
              ref={internalRef}
              className={cn(
                "relative",
                props?.disabled ? "cursor-not-allowed" : "cursor-pointer",
              )}
              onClick={() => {
                if (props?.disabled) return
                setOptionListOpen((prevState) => !prevState)
              }}
            >
              <div
                className={cn(
                  "relative flex justify-between items-center w-full font-[400] text-[14px]",
                  "componentsBox",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  props?.disabled
                    ? "bg-[#DCE5DD] border border-[#CCCCCC] cursor-not-allowed"
                    : "",
                  props?.boxWrapperClass,
                  error && "border-mane-error-color",
                )}
                ref={field.ref}
              >
                <span className={field?.value?.text ? "" : selectedOptionClass}>
                  {field?.value?.text ? field?.value?.text : placeholder}
                </span>

                {props?.disabled ? null : (
                  <ChevronDown
                    className={cn("flex-shrink-0", error ? "text-red-500" : "")}
                  />
                )}
              </div>
              {optionListOpen && (
                <div
                  className={cn(
                    "bg-mane-page-bg-color border border-[#C0C0C0] rounded-sm",
                    "focus:outline-none",
                    "w-full absolute top-full translate-y-[1px] left-0 z-[999] overflow-auto",
                    props?.displayIdToo ? "max-h-48" : "max-h-36",
                    props?.listClass,
                  )}
                >
                  {isEmpty(options) || options?.length === 0 ? (
                    <div className="text-center text-[12px] font-[600] py-2 px-7 text-gray-500">
                      No data available
                    </div>
                  ) : (
                    options?.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          "group cursor-default items-center gap-2 select-none text-mane-primary-dark-color",
                          option?.disable
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-mane-primary-color hover:text-white",
                          props?.listOptionClass,
                        )}
                        onClick={() => {
                          if (option?.disable) return
                          onChange(name, option)
                          field.onChange(option)
                        }}
                      >
                        <p className="text-xs font-semibold py-2 px-7">
                          {option.text}
                        </p>
                        {props?.displayIdToo && (
                          <p
                            className={cn(
                              "text-xs px-7 text-gray-500 -mt-1 pb-2 group-hover:text-white/80",
                            )}
                          >
                            {option?.id}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {error && (
              <p
                className={cn(
                  "text-sm mt-1 text-red-500 font-normal",
                  props?.errorClass,
                )}
              >
                {error?.message ? error?.message : `${label} is required!`}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
