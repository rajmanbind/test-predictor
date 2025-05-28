"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { TableAddButton } from "@/components/common/Table/TableAddButton"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { PGCourseSubTypeList } from "@/utils/static"
import {
  autoComplete,
  cn,
  isEmpty,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import { X } from "lucide-react"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

const courseType: IOption[] = [
  { id: "ug", text: "UG" },
  { id: "pg", text: "PG" },
]

export const courseSubType: IOption[] = [
  { id: "MD/MS/Diploma", text: "MD / MS / Diploma" },
  { id: "DNB", text: "DNB" },
  { id: "DNB-Diploma", text: "DNB-Diploma" },
  { id: "MDS", text: "MDS" },
  { id: "MD/MSAyurveda", text: "MD / MS Ayurveda" },
  { id: "MDHomeopathy", text: "MMD Homeopathy" },
  { id: "DM / MCh", text: "DM/MCh" },
]

export default function ConfigureDropdownPage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [buttonText, setButtonText] = useState("Save Changes")

  const [renderTable, setRenderTable] = useState(false)

  const [formData, setFormData] = useState<any>({})

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  const [updateMode, setUpdateMode] = useState<string>("")
  const { appState } = useAppState()
  const listRef = useRef<HTMLUListElement>(null)

  async function getData(type: string, subType?: string) {
    const res = await fetchData({
      url: "/api/admin/configure/courses/get",
      params: { type, subType },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function addNewRow() {
    setConfigList((prev) => [{ id: null, text: "" }, ...prev])
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text } : item)),
    )
  }

  //   add
  async function onSubmit() {
    if (!formData?.courseType?.id) return

    const newEntries = configList.filter(
      (item) => item.id === null && item.text.trim() !== "",
    )
    if (newEntries.length === 0) return

    const res = await fetchData({
      url: "/api/admin/configure/courses/add",
      method: "POST",
      data: newEntries.map((item) => {
        if (formData?.courseType?.id === "pg") {
          return {
            type: formData?.courseType?.id,
            subType: formData?.subType?.text,
            text: item.text.trim(),
          }
        }

        return {
          type: formData?.courseType?.id,
          text: item.text.trim(),
        }
      }),
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(formData?.courseType?.id, formData?.subType?.text)
    } else {
      showToast("error", "Failed to add options")
    }
  }

  async function updateData(id: number, newText: string) {
    if (!newText.trim()) return

    const res = await fetchData({
      url: "/api/admin/configure/courses/update",
      method: "POST",
      data: {
        id,
        text: newText.trim(),
      },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(formData?.courseType?.id, formData?.subType?.text)
    }
  }

  function removeNewRow(index: number) {
    setConfigList((prev) => prev.filter((_, i) => i !== index))
  }

  async function deleteData() {
    if (!deleteId) return

    const res = await fetchData({
      url: "/api/admin/configure/courses/delete",
      method: "POST",
      data: { id: deleteId },
    })

    if (res?.success) {
      showToast("success", res?.payload?.msg)
      getData(formData?.courseType?.id, formData?.subType?.text)
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
      <Heading>Configure Courses</Heading>

      <Card className="mt-4 p-6 min-h-80">
        <div className="w-full flex max-w-[500px] items-center gap-4">
          <SearchAndSelect
            name="courseType"
            label="Course Type"
            placeholder="Select"
            value={formData?.courseType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)
              if (selectedValue?.id === "ug") {
                setRenderTable(true)
                getData("ug")
              } else {
                setRenderTable(false)
              }
            }}
            control={control}
            setValue={setValue}
            required
            options={courseType}
            debounceDelay={0}
            wrapperClass="max-w-[150px] w-full"
            searchAPI={(text, setOptions) =>
              autoComplete(text, courseType, setOptions)
            }
            errors={errors}
          />

          {formData?.courseType?.id === "pg" && (
            <SearchAndSelect
              name="subType"
              label="Sub Type"
              placeholder="Select"
              value={formData?.subType}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
                setRenderTable(true)
                getData("pg", selectedValue.text)
              }}
              control={control}
              setValue={setValue}
              required
              options={PGCourseSubTypeList}
              debounceDelay={0}
              wrapperClass="max-w-full w-full"
              searchAPI={(text, setOptions) =>
                autoComplete(text, PGCourseSubTypeList, setOptions)
              }
              errors={errors}
            />
          )}
        </div>

        {renderTable && (
          <form
            className="w-full max-w-[500px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-xl text-color-text mt-8 mb-4 flex items-center justify-between">
              Courses Options
              <TableAddButton title="Add More" onClick={addNewRow} />
            </div>

            {shouldRenderComponent(
              [isEmpty(configList), !appState.isLoading],
              "AND",
            ) && (
              <div className="text-color-subtext text-center mt-10 mb-2 w-full border border-color-border py-10">
                No options to show <br /> Please add some...
              </div>
            )}

            <ul
              ref={listRef}
              className="flex flex-col gap-3 w-full max-w-[500px] max-h-[calc(100vh-500px)] overflow-y-auto"
            >
              {configList?.map((item, index) => (
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
                    }}
                    onFocus={(e) => {
                      if (item?.id) {
                        setUpdateMode(e.target.name)
                        if (buttonText === "Update Changes") return
                        setButtonText("Update Changes")
                      } else {
                        if (buttonText === "Save Changes") return
                        setButtonText("Save Changes")
                      }
                    }}
                    onBlur={() => {
                      if (item?.id) {
                        setUpdateMode("")
                        if (item.text !== initialConfigList?.[index]?.text)
                          updateData(item.id, item.text)
                      }
                    }}
                    control={control}
                    errors={errors}
                    wrapperClass={cn(
                      "w-full",
                      String(index) === updateMode && "z-[1001]",
                    )}
                  />

                  {item.id ? (
                    <X
                      className={cn(
                        "text-color-subtext hover:text-red-600 cursor-pointer border-none outline-none",
                        initialConfigList?.length === 1 && "opacity-50",
                      )}
                      size={20}
                      data-tooltip-id={
                        initialConfigList?.length === 1 ? "tooltip" : ""
                      }
                      data-tooltip-content="You Can't Delete the Last Option"
                      onClick={() => {
                        if (initialConfigList?.length === 1) return

                        setDeleteId(item.id)
                        setPopupOpen(true)
                      }}
                    />
                  ) : (
                    <X
                      className="text-color-subtext hover:text-red-600 cursor-pointer border-none outline-none"
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

      {updateMode && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-[1000]"></div>
      )}

      <ConfirmationPopup
        isOpen={popupOpen}
        title="Are You Sure You Want To Delete?"
        text="This action cannot be undone."
        onClose={() => setPopupOpen(false)}
        onConfirm={deleteData}
      />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}

