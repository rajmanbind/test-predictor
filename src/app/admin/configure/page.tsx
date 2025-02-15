"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { TableAddButton } from "@/components/common/TableAddButton"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import { X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const dropDownType: IOption[] = [
  { id: 0, text: "CATEGORY" },
  { id: 1, text: "QUOTA" },
]

export default function ConfigurePage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<IOption | undefined>()
  const [buttonText, setButtonText] = useState("Save Changes")

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  useEffect(() => {
    if (selectedType) getData(selectedType.text)
  }, [selectedType])

  async function getData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure/get",
      params: { type },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function addNewRow() {
    setConfigList((prev) => [{ id: null, text: "" }, ...prev])
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text } : item)),
    )
  }

  async function onSubmit() {
    if (!selectedType) return

    const newEntries = configList.filter(
      (item) => item.id === null && item.text.trim() !== "",
    )
    if (newEntries.length === 0) return

    const res = await fetchData({
      url: "/api/admin/configure/add",
      method: "POST",
      data: newEntries.map((item) => ({
        type: selectedType.text,
        text: item.text,
      })),
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(selectedType.text)
    } else {
      showToast("error", "Failed to add options")
    }
  }

  async function updateData(id: number, newText: string) {
    if (!newText.trim()) return

    const res = await fetchData({
      url: "/api/admin/configure/update",
      method: "POST",
      data: { id, text: newText },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(selectedType!.text)
    }
  }

  function removeNewRow(index: number) {
    setConfigList((prev) => prev.filter((_, i) => i !== index))
  }

  async function deleteData() {
    if (!deleteId) return

    const res = await fetchData({
      url: "/api/admin/configure/delete",
      method: "POST",
      data: { id: deleteId },
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(selectedType!.text)
      setPopupOpen(false)
    } else {
      showToast("error", "Failed to delete")
    }
  }

  const isSaveDisabled =
    configList?.length === 0 ||
    configList?.some((item) => item.text.trim() === "") ||
    JSON.stringify(configList) === JSON.stringify(initialConfigList)

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Dropdowns</Heading>

      <Card className="mt-4 p-6 min-h-80">
        <div className="w-full max-w-96">
          <SearchAndSelect
            name="dropDownType"
            label="Select Dropdown Type"
            placeholder="Select Dropdown Type"
            value={selectedType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, () => {})
              setSelectedType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={dropDownType}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, dropDownType, setOptions)
            }
            errors={errors}
          />
        </div>

        {shouldRenderComponent([selectedType, configList], "AND") && (
          <form
            className="w-full max-w-[500px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-xl text-color-text mt-8 mb-4 flex items-center justify-between">
              {selectedType?.text} Options
              <TableAddButton title="Add More" onClick={addNewRow} />
            </div>

            <ul className="flex flex-col gap-3 w-full max-w-[500px] max-h-[calc(100vh-500px)] overflow-y-auto">
              {configList.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2 text-color-subtext py-2 mr-4 text-sm"
                >
                  <Input
                    name={String(index)}
                    placeholder="Enter here"
                    value={item.text}
                    setValue={setValue}
                    onChange={(e) => {
                      updateText(index, e.target.value)

                      if (item?.id) {
                        if (buttonText === "Update Changes") return
                        setButtonText("Update Changes")
                      } else {
                        if (buttonText === "Save Changes") return
                        setButtonText("Save Changes")
                      }
                    }}
                    onBlur={() => item?.id && updateData(item.id, item.text)}
                    control={control}
                    errors={errors}
                    wrapperClass="w-full"
                  />

                  {item.id ? (
                    <X
                      className="text-color-subtext hover:text-red-600 cursor-pointer"
                      size={20}
                      onClick={() => {
                        setDeleteId(item.id)
                        setPopupOpen(true)
                      }}
                    />
                  ) : (
                    <X
                      className="text-color-subtext hover:text-red-600 cursor-pointer"
                      size={20}
                      onClick={() => removeNewRow(index)}
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="flex mt-8 items-center justify-end mb-8">
              <Button className="py-2" type="submit" disabled={isSaveDisabled}>
                {buttonText}
              </Button>
            </div>
          </form>
        )}
      </Card>

      <ConfirmationPopup
        isOpen={popupOpen}
        title="Are You Sure You Want To Delete?"
        text="This action cannot be undone."
        onClose={() => setPopupOpen(false)}
        onConfirm={deleteData}
      />
    </BELayout>
  )
}
