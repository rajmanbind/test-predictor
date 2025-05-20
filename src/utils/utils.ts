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

type ISetStateWithPrev = (
  data: Record<string, any>, // An object with key-value pairs
  setState: React.Dispatch<React.SetStateAction<any>>,
) => void

export const setStateWithPrev: ISetStateWithPrev = (data, setState) => {
  setState((prevState: any) => {
    const newState = { ...prevState }

    Object.keys(data).forEach((key) => {
      const value = data[key]

      // Handle nested object structure using dot notation
      if (key.includes(".")) {
        const keys = key.split(".")
        let nested = newState

        for (let i = 0; i < keys.length - 1; i++) {
          if (!nested[keys[i]]) nested[keys[i]] = {} // Ensure the nested object exists
          nested = nested[keys[i]]
        }

        nested[keys[keys.length - 1]] = value // Set the value in the deepest object
      } else {
        newState[key] = value // Set the value directly for non-nested keys
      }
    })

    return newState
  })
}

export function createPayload(data: any) {
  const payload: any = {}

  Object.entries(data).forEach(([key, value]) => {
    if (!isEmpty(value)) {
      payload[key] = String(value).trim()
    }
  })

  return payload
}

export function clearReactHookFormValueAndStates(
  fields: string[],
  setValue: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
) {
  const statePayload: any = {}

  fields?.forEach((field) => {
    setValue(field, "")
    statePayload[field] = ""
  })

  setStateWithPrev(statePayload, setState)
}

export function onPageChange(
  page: number,
  url: string,
  fetchData: any,
  setState: any,
  params?: any,
) {
  fetchData({
    url,
    params: {
      page,
      size: 10,
      ...params,
    },
  }).then((data: any) => {
    setState(data?.payload)
  })
}

export function updateQueryParams(router: any, updatedParams: any) {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)

  Object.entries(updatedParams).forEach(([key, value]: any) => {
    params.set(key, value)
  })

  router.push(`?${params.toString()}`, { scroll: false })
}

export function getPhoneFromUser(user: any) {
  if (!user) return null
  const phone = user?.payload?.user?.phone ?? null
  return phone
}

