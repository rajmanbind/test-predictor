import { IOption } from "@/types/GlobalTypes"
import clsx, { ClassValue } from "clsx"
import { Dispatch, SetStateAction } from "react"
import { twMerge } from "tailwind-merge"

let debounceTimeout: NodeJS.Timeout
export function debounce(func: (...args: any[]) => void, wait = 200) {
  return (...args: any[]) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => func(...args), wait)
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmpty(value: any) {
  return (
    value === undefined || value === null || value === "" || value?.length === 0
  )
}

export function saveToLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error: any) {
    console.error(`Error saving key "${key}" to localStorage:`, error)
  }
}

export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error: any) {
    return null // <-- If JSON parsing fails, return null
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error: any) {}
}

export function onTextFieldChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setState: Dispatch<SetStateAction<any>>,
) {
  const { name, value } = e.target

  setState((prevState: any) => ({
    ...prevState,
    [name]: value,
  }))
}

export function onOptionSelected(
  filedName: string,
  selectedOption: any,
  setState: Dispatch<SetStateAction<any>>,
) {
  setState((prevState: any) => ({
    ...prevState,
    [filedName]: selectedOption,
  }))
}

export function autoComplete(
  text: string,
  data: IOption[],
  setOptions: React.Dispatch<SetStateAction<IOption[]>>,
) {
  setOptions(
    data.filter((item) =>
      item?.text?.toLowerCase().includes(text.toLowerCase()),
    ),
  )
}

export function shouldRenderComponent(
  conditions: any[],
  operator: "AND" | "OR",
): boolean {
  const evaluatedConditions = conditions.map((condition) =>
    typeof condition === "boolean" ? condition : !isEmpty(condition),
  )

  if (operator === "AND") {
    return evaluatedConditions.every(Boolean)
  }
  if (operator === "OR") {
    return evaluatedConditions.some(Boolean)
  }
  return false
}
