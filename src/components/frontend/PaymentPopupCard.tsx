"use client"

import PaymentCard from "@/app/[id]/cutoff/PaymentCard"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import React, { ReactNode } from "react"

interface IPaymentPopupCardProps {
  isOpen: boolean

  title: ReactNode
  btnText: string
  paymentDescription: string
  amount: number

  successCallback?: (orderId: string) => void
  errorCallback?: (orderId: string) => void
  onClose: () => void
}

export function PaymentPopupCard({
  isOpen,

  title,
  btnText,
  paymentDescription,
  amount,

  successCallback,
  errorCallback,
  onClose,
}: IPaymentPopupCardProps) {
  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="150px"
      popupClass="w-[340px] pc:w-[380px]"
      closeIconClass="text-white hover:text-white tab:top-2 tab:right-2"
    >
      <PaymentCard
        successCallback={successCallback}
        errorCallback={errorCallback}
        amount={amount}
        paymentDescription={paymentDescription}
        title={title}
        btnText={btnText}
      />
    </AnimatedPopup>
  )
}

