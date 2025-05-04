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
                    Enter Your NEET Rank
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Start by filling in your valid NEET UG or PG rank in the
                    input field.
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
                    Select Your State
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Choose the state where you are looking to take admission.
                    This helps narrow down college options based on
                    state-specific quotas.
                  </p>
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
                    Choose the Course
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Select whether you're applying for MBBS, MD, or MS. The
                    predictor adapts based on your course choice.`}
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
                    Choose Your Category
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Pick your reservation category (like General, OBC, SC, ST,
                    etc.) so the prediction is aligned with applicable quotas
                    and cutoff variations.
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
                    {`Click “Predict My College”`}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Hit the button and instantly view a list of colleges where
                    you are most likely to get admission, based on last year's
                    closing ranks.`}
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
                    Explore and Compare Colleges
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {`Review predicted colleges, compare fees, last year's
                    cut-offs, and seat types to make a confident, well-informed
                    decision.`}
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

        <div>
          <h2 className="text-3xl font-bold text-center py-20">
            Why Choose Us
          </h2>

          {/* Benefits Section */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 text-black"
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
              <h3 className="font-bold mb-2 text-lg">
                Focused on Private and Deemed Medical Colleges
              </h3>
              <p className="text-gray-600 text-sm">
                We specialize in providing accurate information exclusively for
                private and deemed medical colleges across India, helping you
                make informed decisions for both MBBS and MD/MS admissions.
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
              <h3 className="font-bold mb-2 text-lg">
                Comprehensive Cutoff Data for MBBS and MD/MS
              </h3>
              <p className="text-gray-600 text-sm">
                {`Access last year's detailed cutoff information — college-wise and category-wise — for MBBS and across all MD/MS specializations.
                This gives you complete clarity to plan your medical admission journey with confidence.`}
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
              <h3 className="font-bold mb-2 text-lg">
                Authentic Information Sourced from Official Authorities
              </h3>
              <p className="text-gray-600 text-sm">
                {`All our data is directly sourced from official counseling
                authority websites, ensuring it's genuine, verified, and
                completely up-to-date — no manipulation, no guesswork.`}
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="font-bold mb-2 text-lg">
                Personalized Counseling for Management and NRI Quota
              </h3>
              <p className="text-gray-600 text-sm">
                {`Private medical education is a significant investment, and a single mistake can cost a valuable seat.
                We offer paid personalized counseling (via phone, WhatsApp, and in-person) specifically for Management and NRI quota admissions — expert guidance that goes beyond what the portal alone can offer.`}
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <Award className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2 text-lg">
                Simple, Transparent Process
              </h3>
              <p className="text-gray-600 text-sm">
                {`Our platform is clean and easy to use — check cutoff details instantly and reach out when you need one-on-one support.
                No confusing dashboards. No hidden steps.`}
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="font-bold mb-2 text-lg">
                Trusted by Medical Aspirants
              </h3>
              <p className="text-gray-600 text-sm">
                {`Every year, hundreds of MBBS and MD/MS aspirants rely on CollegeCutoff.net for accurate information and genuine support throughout their admission process.`}
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
              Join 30,000+ students who found their perfect medical college
              match
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
