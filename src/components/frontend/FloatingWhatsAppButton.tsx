"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"

function FloatingWhatsAppButton() {
  return (
    <Link
      href="https://wa.me/919522235235"
      className="fixed z-[999] right-0 bottom-0 m-8 cursor-pointer"
    >
      <Image
        className="drop-shadow-lg hover:scale-125 transition-all duration-200"
        src="/whatsapp.svg"
        width={50}
        height={50}
        alt="whatsapp"
      />
    </Link>
  )
}

export default FloatingWhatsAppButton
