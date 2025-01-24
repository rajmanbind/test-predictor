import { cn } from "@/utils/utils"
import { CircleCheckBig, CircleX } from "lucide-react"
import React, { ReactNode, useLayoutEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function ToastProvider() {
  return (
    <ToastContainer
      toastClassName={`relative flex items-center justify-between w-full p-3 rounded-md shadow-lg`}
      className="max-w-xs sm:max-w-sm mt-[100px]"
    />
  )
}

export function showToast(
  type: "success" | "error" = "success",
  message: ReactNode,
) {
  const toastConfig = {
    success: {
      className: "!bg-[#4BB543]/95",
      icon: <CircleCheckBig color="#fff" />,
    },
    error: {
      className: "!bg-red-600/95",
      icon: <CircleX color="#fff" />,
    },
  }

  toast(message, {
    icon: toastConfig[type].icon,
    className: cn(
      `relative flex items-center p-3 rounded-md shadow-lg !text-white`,
      toastConfig[type].className,
    ),
    progressClassName: "toastify_progressbar_color", // Ensures the progress bar is plain white
    closeButton: false,
    pauseOnHover: true,
    closeOnClick: true,
  })
}
