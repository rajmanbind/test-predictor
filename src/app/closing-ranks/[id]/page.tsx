"use client"

import SearchAndSelect from "@/components/common/SearchAndSelect"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { PGCourseSubTypeList } from "@/utils/static"
import {
  autoComplete,
  clearReactHookFormValueAndStates,
  isEmpty,
} from "@/utils/utils"
import { ArrowRight, Info, MapPin, Search, Users } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"

type StateData = {
  name: string
  slug: string
  popular?: boolean
}

// States and Union Territories data
const states: StateData[] = [
  {
    name: "Andaman and Nicobar Islands",
    slug: "andaman-and-nicobar-islands",
  },
  { name: "Andhra Pradesh", slug: "andhra-pradesh", popular: true },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh" },
  { name: "Assam", slug: "assam" },
  { name: "Bihar", slug: "bihar" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Chhattisgarh", slug: "chhattisgarh" },
  { name: "Dadra and Nagar Haveli", slug: "dadra-and-nagar-haveli" },
  { name: "Delhi", slug: "delhi" },
  { name: "Daman and Diu", slug: "daman-and-diu" },
  { name: "Goa", slug: "goa" },
  { name: "Gujarat", slug: "gujarat", popular: true },
  { name: "Haryana", slug: "haryana" },
  { name: "Himachal Pradesh", slug: "himachal-pradesh" },
  { name: "Jammu and Kashmir", slug: "jammu-and-kashmir" },
  { name: "Jharkhand", slug: "jharkhand" },
  { name: "Karnataka", slug: "karnataka", popular: true },
  { name: "Kerala", slug: "kerala", popular: true },
  { name: "Ladakh", slug: "ladakh" },
  { name: "Lakshadweep", slug: "lakshadweep" },
  { name: "Madhya Pradesh", slug: "madhya-pradesh" },
  { name: "Maharashtra", slug: "maharashtra", popular: true },
  { name: "Manipur", slug: "manipur" },
  { name: "Meghalaya", slug: "meghalaya" },
  { name: "Mizoram", slug: "mizoram" },
  { name: "Nagaland", slug: "nagaland" },
  { name: "Odisha", slug: "odisha" },
  { name: "Pondicherry", slug: "pondicherry" },
  { name: "Punjab", slug: "punjab" },
  { name: "Rajasthan", slug: "rajasthan" },
  { name: "Sikkim", slug: "sikkim" },
  { name: "Tamil Nadu", slug: "tamil-nadu", popular: true },
  { name: "Telangana", slug: "telangana", popular: true },
  { name: "Tripura", slug: "tripura" },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", popular: true },
  { name: "Uttarakhand", slug: "uttarakhand" },
  { name: "West Bengal", slug: "west-bengal" },
]

const courseTypeList: IOption[] = [
  { id: "ug", text: "UG" },
  { id: "pg", text: "PG" },
]

export default function ClosingRanks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [courseList, setCourseList] = useState<IOption[]>([])
  const [selectedType, setSelectedType] = useState<IOption | undefined>()
  const [selectedCourse, setSelectedCourse] = useState<IOption | undefined>()
  const { getSearchParams } = useInternalSearchParams()

  const router = useRouter()
  const params = useParams()
  const { setAppState } = useAppState()

  const { fetchData } = useFetch()

  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (params.id === "ug") {
      getCoursesData()
    }
  }, [])

  async function getCoursesData() {
    const res = await fetchData({
      url: "/api/admin/configure/courses/get",
      params: { type: "ug" },
    })

    if (res?.payload?.data?.length > 0) {
      setCourseList(res?.payload?.data)
    }
  }

  // Filter states based on search query and active tab
  const filteredStates = states.filter((state) => {
    const matchesSearch = state.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" || (activeTab === "popular" && state.popular)
    return matchesSearch && matchesTab
  })

  const { showToast } = useAppState()

  function redirectURL(state: any) {
    if (isEmpty(selectedCourse?.text) || selectedCourse?.text === "EMPTY") {
      return ""
    }

    return `/closing-ranks/${params.id}/${state}?course=${getSearchParams("course")}`
  }

  function onLinkClick() {
    if (isEmpty(selectedCourse?.text) || selectedCourse?.text === "EMPTY") {
      router.replace(`/closing-ranks/${params.id}`)

      setError("course", {
        type: "manual",
        message: "Please select a Course",
      })
      showToast("error", "Please select a Course")
    }
  }

  return (
    <FELayout>
      <>
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="pb-10 pt-1 pc:mt-10 px-3">
            <div className="pc:translate-y-[-90px] translate-y-[-30px]  pc:px-4 px-3 max-w-[500px] flex flex-col pc:flex-row pc:items-center gap-4 pc:gap-6">
              <SearchAndSelect
                name="courseType"
                labelNode={
                  <div className="text-lg font-bold text-color-accent">
                    Course Type
                  </div>
                }
                boxWrapperClass="border-color-accent"
                placeholder="Course Type"
                value={selectedType}
                
                onChange={({ selectedValue }) => {
                  router.replace(
                    `/closing-ranks/${selectedValue?.text.toLowerCase()}`,
                  )

                  setSelectedType(selectedValue)

                  if (selectedValue?.id === "ug") {
                    getCoursesData()
                    setSelectedCourse({ id: "", text: "EMPTY" })
                  } else {
                    setAppState({ isLoading: true })
                    setCourseList([])
                    setTimeout(() => {
                      setCourseList(PGCourseSubTypeList)
                      setAppState({ isLoading: false })
                      setSelectedCourse({ id: "", text: "EMPTY" })
                      clearReactHookFormValueAndStates(["course"], setValue)
                    }, 1000)
                  }
                }}
                control={control}
                setValue={setValue}
                options={courseTypeList}
                debounceDelay={0}
                searchAPI={(text, setOptions) =>
                  autoComplete(text, courseTypeList, setOptions)
                }
                wrapperClass="max-w-[150px]"
                errors={errors}
              />

              <SearchAndSelect
                name="course"
                labelNode={
                  <div className="text-lg font-bold text-color-accent">
                    Select Course
                  </div>
                }
                placeholder="Select Course"
                value={selectedCourse}
                boxWrapperClass="border-color-accent"
                onChange={({ selectedValue }) => {
                  setSelectedCourse(selectedValue)

                  router.replace(
                    `/closing-ranks/${params?.id}?course=${encodeURIComponent(
                      selectedValue?.text,
                    )}`,
                  )

                  clearErrors("course")
                }}
                control={control}
                setValue={setValue}
                defaultOption={{
                  id: getSearchParams("course").replaceAll(" ", ""),
                  text: getSearchParams("course"),
                }}
                required
                errorClass="absolute"
                options={courseList}
                debounceDelay={0}
                wrapperClass="max-w-full w-full"
                searchAPI={(text, setOptions) =>
                  autoComplete(text, courseList, setOptions)
                }
                disabled={isEmpty(courseList)}
                errors={errors}
              />
            </div>

            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
                NEET {params?.id?.toString()?.toUpperCase()}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-color-table-header">
                Medical College Closing Ranks
              </h1>
              <p className="text-gray-600 md:text-lg mb-8 max-w-2xl">
                Explore NEET closing ranks for medical colleges across all
                states and union territories in India. Find the right college
                based on previous year cutoffs.
              </p>

              <div className="w-full max-w-2xl relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for a state or union territory..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12 md:py-16">
          <Container className="px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  States & Union Territories
                </h2>
                <p className="text-gray-500">
                  Select a region to view detailed closing ranks
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All States
                </button>
                <button
                  onClick={() => setActiveTab("popular")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "popular"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Popular States
                </button>
              </div>
            </div>

            {/* States Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStates.map((state) => (
                <Link
                  href={redirectURL(state.name)}
                  key={state.slug}
                  className="group bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md hover:border-yellow-300 flex flex-col"
                  onClick={onLinkClick}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-yellow-500" />
                      <h3 className="font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {state.name}
                      </h3>
                    </div>
                    {state.popular && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {state.name} - {params?.id?.toString()?.toUpperCase()}{" "}
                    Medical
                  </p>
                  <div className="mt-auto flex items-center text-sm text-yellow-600 font-medium">
                    View Closing Ranks
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

            {filteredStates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No states found matching your search criteria.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-yellow-600 font-medium hover:text-yellow-700"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Expert Guidance CTA */}
            <div className="mt-16 border border-color-accent rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Need personalized guidance?
                </h3>
                <p className="text-gray-600">
                  Connect with our expert counselors to get personalized college
                  recommendations based on your NEET rank and preferences.
                </p>
              </div>
              <Link
                href="https://wa.me/919028009835"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Book Counselling Session
              </Link>
            </div>
          </Container>
        </section>
      </>
      <SignInPopup />
    </FELayout>
  )
}

