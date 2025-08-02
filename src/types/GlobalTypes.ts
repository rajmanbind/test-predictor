import { Control, FieldErrors, FieldValues } from "react-hook-form"

export interface IOption {
  id: any
  text: string
  disable?: boolean
  otherValues?: any
  code?:string
  type?:string
}

export interface ICommonComponentProps {
  label?: string
  name: string
  setValue: any
  labelHint?: React.ReactNode
  labelTooltipIcon?: React.ReactNode
  placeholder?: string
  required?: boolean | string
  disabled?: boolean
  errors: FieldErrors<FieldValues>
  control: Control<any>
  defaultOption?: IOption
  wrapperClass?: string
  boxWrapperClass?: string
  errorClass?: string
}

