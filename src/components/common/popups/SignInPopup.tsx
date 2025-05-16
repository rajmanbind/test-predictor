"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Lock,
  Search,
  Smartphone,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"

import { Button } from "../Button"
import { Logo } from "../Logo"

type CountryCode = {
  code: string
  name: string
  dial_code: string
  flag: string
}

export function SignInPopup({
  successCallback,
  errorCallback,
  noRedirect,
}: {
  successCallback?: any
  errorCallback?: any
  noRedirect?: boolean
}) {
  const { appState, setAppState } = useAppState()

  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")
  const [showCountrySelector, setShowCountrySelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: "IN",
    name: "India",
    dial_code: "+91",
    flag: "🇮🇳",
  })

  const countrySelectorRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const { showToast } = useAppState()

  const { fetchData } = useFetch()

  // List of country codes (abbreviated for brevity)
  const countryCodes: CountryCode[] = [
    { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
    { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
    { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
    { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
    { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
    { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
    { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
    { code: "BR", name: "Brazil", dial_code: "+55", flag: "🇧🇷" },
    { code: "RU", name: "Russia", dial_code: "+7", flag: "🇷🇺" },
    { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
    { code: "AE", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪" },
    { code: "SA", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦" },
    { code: "ZA", name: "South Africa", dial_code: "+27", flag: "🇿🇦" },
    { code: "MX", name: "Mexico", dial_code: "+52", flag: "🇲🇽" },
    { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
    { code: "KR", name: "South Korea", dial_code: "+82", flag: "🇰🇷" },
    { code: "NZ", name: "New Zealand", dial_code: "+64", flag: "🇳🇿" },
  ]

  // Filter countries based on search query
  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery),
  )

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  // Handle backspace in OTP input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  // Handle Phone Number submission
  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid Phone Number")
      return
    }

    setIsSubmitting(true)

    const res = await fetchData({
      url: "/api/user/login/send_otp",
      method: "POST",
      data: {
        phone: `${selectedCountry?.dial_code}${phoneNumber}`,
      },
      noLoading: true,
    })

    setIsSubmitting(false)
    if (res?.success) {
      setStep("otp")
      setCountdown(60)
    }
  }

  // Handle OTP verification
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsSubmitting(true)

    const res = await fetchData({
      url: "/api/user/login/verify_otp",
      method: "POST",
      data: {
        phone: `${selectedCountry?.dial_code}${phoneNumber}`,
        token: otpValue,
      },
      noLoading: true,
    })

    setIsSubmitting(false)

    if (res?.success) {
      // Successful login - close modal and reset state
      setAppState({ signInModalOpen: false })

      setStep("phone")
      setPhoneNumber("")
      setOtp(["", "", "", "", "", ""])

      if (typeof successCallback === "function") {
        successCallback?.()
      } else {
        if (!noRedirect) {
          router.replace("/closing-ranks")
        }
      }
    }
  }

  // Handle resend OTP
  const handleResendOtp = () => {
    if (countdown > 0) return

    // Simulate API call to resend OTP
    setCountdown(60)
  }

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setAppState({ signInModalOpen: false })
    }
  }

  // Close country selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countrySelectorRef.current &&
        !countrySelectorRef.current.contains(event.target as Node)
      ) {
        setShowCountrySelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Reset state when modal closes
  useEffect(() => {
    if (!appState?.signInModalOpen) {
      setTimeout(() => {
        setStep("phone")
        setPhoneNumber("")
        setOtp(["", "", "", "", "", ""])
        setError("")
        setShowCountrySelector(false)
        setSearchQuery("")
      }, 300)
    }
  }, [appState?.signInModalOpen])

  // Format Phone Number for display
  const formatPhoneForDisplay = () => {
    if (phoneNumber.length <= 4) {
      return phoneNumber
    }
    return `${phoneNumber.substring(0, 4)}•••${phoneNumber.substring(phoneNumber.length - 2)}`
  }

  if (!appState?.signInModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <Logo textStyle="text-black text-xl font-medium" />
          <button
            onClick={() => setAppState({ signInModalOpen: false })}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {step === "phone" ? "Sign in / Sign up" : "Verify OTP"}
          </h2>
          <p className="text-gray-600">
            {step === "phone"
              ? "Enter your Phone Number to continue"
              : "Enter the 6-digit code sent to your Phone Number."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative flex">
                {/* Country Code Selector */}
                <div className="relative" ref={countrySelectorRef}>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 h-[50px] border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    onClick={() => setShowCountrySelector(!showCountrySelector)}
                  >
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium">
                      {selectedCountry.dial_code}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Country Dropdown */}
                  {showCountrySelector && (
                    <div className="absolute z-10 mt-1 left-0 w-64 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="py-1">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelectedCountry(country)
                              setShowCountrySelector(false)
                              setSearchQuery("")
                            }}
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm font-medium">
                              {country.name}
                            </span>
                            <span className="text-xs text-color-accent ml-auto">
                              {country.dial_code}
                            </span>
                          </button>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your Phone Number"
                    value={phoneNumber}
                    maxLength={12}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setPhoneNumber(value)
                    }}
                    required
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {`We'll send a verification code to this Phone Number`}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full py-3 h-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:text-black/80 text-black font-medium shadow-md flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2   border-black border-t-transparent rounded-full animate-spin"></div>
                  Sending Code...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-yellow-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-yellow-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="flex items-center justify-between gap-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Sent to: {selectedCountry.dial_code} {formatPhoneForDisplay()}
                </p>
                <button
                  type="button"
                  className={`text-xs ${countdown > 0 ? "text-gray-400" : "text-yellow-600 hover:text-yellow-700"}`}
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 h-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:text-black/80 text-black font-medium shadow-md flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify and Continue
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-4">
              <button
                type="button"
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setStep("phone")
                  setOtp(["", "", "", "", "", ""])
                }}
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Your information is secure and encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

