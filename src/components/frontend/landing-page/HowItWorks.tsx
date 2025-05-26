"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  Award,
  BarChart,
  BookOpen,
  Building,
  CheckSquare,
  ClipboardList,
  Compass,
  FileText,
  GraduationCap,
  Lightbulb,
  Search,
  Users,
} from "lucide-react"

import WhyChooseUs from "./WhyChooseUS"

export default function HowItWorks() {
  return (
    <section className="w-full py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-color-table-header">
            How It Works
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Simple steps to find your perfect medical college match
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative mb-20">
          <div className="grid grid-cols-3 gap-8 gap-y-24 text-black">
            {/* Step 1 */}
            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  1
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                      <ClipboardList className="h-10 w-10 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    Select the Course Type
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Start by selecting whether you're applying for UG or PG
                    medical admissions.`}
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <FileText className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  2
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Search className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    Select Rank/Score Type (Radio Button)
                  </h3>
                  <div className="mb-6 text-gray-600 ">
                    <p className="text-center ">
                      Choose the appropriate option using the radio buttons:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
                      <li>For UG, pick either Rank or Marks</li>
                      <li>For PG, pick either Rank or Percentile</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <BarChart className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  3
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                      <CheckSquare className="h-10 w-10 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    Enter Your Details
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Based on your radio selection, enter your valid NEET Rank, Marks, or Percentile in the input field.`}
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <Compass className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Step 4 */}

            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  4
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Search className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    Select Your Domicile State
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Choose the state you belong to (your domicile). This helps
                    filter colleges under state-specific quotas.
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <BarChart className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  5
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                      <CheckSquare className="h-10 w-10 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    {`Choose Your Course`}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Select the medical course you're interested in — like MBBS, BDS, BAMS, BHMS, MD, MS, etc.`}
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <Compass className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="relative">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                  6
                </div>
                <div className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Search className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">
                    Predict Your College
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Click on “Predict My College” to get a list of private and deemed medical colleges you are eligible for, based on the most updated and accurate cutoff data.`}
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <BarChart className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="lg:hidden space-y-12">
          {/* Step 1 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
              1
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                <ClipboardList className="h-10 w-10 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enter Your Details</h3>
                <p className="text-gray-600 mb-4">
                  Provide your NEET rank, state, preferred course, and category
                  to get started.
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-800 mb-1 text-sm">
                    {`What you'll need:`}
                  </h4>
                  <p className="text-xs text-gray-700">
                    NEET rank, state, category, and course preferences
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
              2
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-6 items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                <Search className="h-10 w-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Get College Predictions
                </h3>
                <p className="text-gray-600 mb-4">
                  Our algorithm analyzes your data and provides accurate college
                  matches.
                </p>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <h4 className="font-medium text-emerald-800 mb-1 text-sm">
                    {`What you'll receive:`}
                  </h4>
                  <p className="text-xs text-gray-700">
                    College list, admission probabilities, and cutoff trends
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              3
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                <CheckSquare className="h-10 w-10 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Make Informed Decisions
                </h3>
                <p className="text-gray-600 mb-4">
                  Compare colleges, explore specializations, and plan your
                  medical career.
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-800 mb-1 text-sm">
                    Tools at your disposal:
                  </h4>
                  <p className="text-xs text-gray-700">
                    Comparison tools, counseling, and career planning
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

