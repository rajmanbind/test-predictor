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

export default function HowItWorks() {
  return (
    <section className="w-full py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Simple steps to find your perfect medical college match
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative mb-20">
          <div className="grid grid-cols-3 gap-8">
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
                    Enter Your Details
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Provide your NEET rank, state, preferred course, and
                    category to get started with personalized recommendations.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {`What you'll need:`}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Your NEET UG rank</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>State of domicile</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Category (General/OBC/SC/ST/EWS)</span>
                      </li>
                    </ul>
                  </div>
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
                    Get College Predictions
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Our advanced algorithm analyzes your data against historical
                    trends to provide accurate college matches tailored to your
                    profile.
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      {`What you'll receive:`}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{`List of colleges you're likely to get`}</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Admission probability scores</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Previous year cutoff trends</span>
                      </li>
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
                    Make Informed Decisions
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Compare colleges, explore specializations, and plan your
                    medical career with confidence using our detailed insights.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Tools at your disposal:
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>College comparison tools</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Expert counseling sessions</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Career roadmap planning</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
                  <Compass className="h-10 w-10 text-white" />
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

        {/* Benefits Section */}
        <motion.div
          className="mt-24 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <Lightbulb className="h-7 w-7 text-yellow-600" />
            </div>
            <h3 className="font-bold mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600 text-sm">
              Our predictions are based on historical data and current trends
              for maximum accuracy
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Users className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="font-bold mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Get guidance from experienced counselors who understand the
              medical admission process
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="h-7 w-7 text-yellow-600" />
            </div>
            <h3 className="font-bold mb-2">Proven Results</h3>
            <p className="text-gray-600 text-sm">
              Thousands of students have successfully found their ideal medical
              college with our help
            </p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Try Our College Predictor Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-500 mt-4">
            Join 30,000+ students who found their perfect medical college match
          </p>
        </motion.div>
      </div>
    </section>
  )
}
