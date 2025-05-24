"use client"

import { Button } from "@/components/common/Button"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { motion } from "framer-motion"
import {
  AlertCircle,
  ArrowRight,
  BarChart,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  Phone,
  Video,
} from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useState } from "react"

type PackageFeature = {
  icon: React.ReactNode
  title: string
  description: string
}

type Package = {
  id: string
  name: string
  tagline: string
  originalPrice: number
  discountedPrice: number
  validTill: string
  features: PackageFeature[]
  popular?: boolean
}

export default function PackagesPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const packages: Package[] = [
    {
      id: "pro",
      name: "Pro",
      tagline: "All India & State Counsellings",
      originalPrice: 4499,
      discountedPrice: 3999,
      validTill: "December 5th 2025",
      popular: true,
      features: [
        {
          icon: <Phone className="h-5 w-5 text-yellow-600" />,
          title: "Priority Call & Email Support",
          description:
            "Get priority support via call and email with 24-hour response time",
        },
        {
          icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
          title: "Latest Updates through Events and Announcements",
          description:
            "Stay informed with real-time updates on counselling events and important announcements",
        },
        {
          icon: <Video className="h-5 w-5 text-yellow-600" />,
          title: "Premium Videos & Webinars",
          description:
            "Access to exclusive video content and interactive webinars with medical education experts",
        },
        {
          icon: <FileText className="h-5 w-5 text-yellow-600" />,
          title: "Comprehensive, Up-to-Date Information & Insights",
          description:
            "Detailed insights on colleges, specializations, and admission processes with regular updates",
        },
        {
          icon: <BarChart className="h-5 w-5 text-yellow-600" />,
          title:
            "Pro Tools - Allotment Mapping & Rank Scan for Cross-Counselling Comparison",
          description:
            "Advanced tools to compare allotments across different counselling rounds and predict outcomes based on your rank",
        },
        {
          icon: <MapPin className="h-5 w-5 text-yellow-600" />,
          title: "All India & 35+ State Counsellings Covered",
          description:
            "Complete guidance for both All India Quota and all state counselling processes across India",
        },
      ],
    },
  ]

  const faqs = [
    {
      question: "What is included in the packages?",
      answer:
        "Our packages include various levels of counselling support, from basic information access to personalized guidance. Each package offers different features like priority support, premium content, advanced tools, and coverage of different counselling processes based on the tier you choose.",
    },
    {
      question: "How long is my package valid?",
      answer:
        "All packages are valid for 6 months from the date of purchase. This ensures you have access to our services throughout all counselling rounds and admission processes within this period.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "All purchases on our website are non-refundable. Please review the package details carefully before making a purchase. If you have any questions, contact our support team for clarification.",
    },
    {
      question: "How do I access the features after purchase?",
      answer:
        "You can access your features instantly after purchase—just revisit this page. For personalized counselling sessions, our team will contact you to schedule appointments.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <FELayout>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-20 blur-3xl -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 blur-3xl -z-10"></div>

        <Container className="px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
              NEET UG 2025
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-color-table-header">
              Premium Counselling Packages
            </h1>
            <p className="text-gray-600 md:text-lg mb-8 max-w-2xl">
              Choose the right package for your NEET counselling needs and
              secure admission in your dream medical college with expert
              guidance
            </p>
          </div>
        </Container>
      </section>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 text-center text-white">
        <Container className="px-4">
          <p className="font-medium">
            Special Offer - Flat ₹500 Off on all packages!
          </p>
        </Container>
      </div>

      {/* Packages Section */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-color-modal-background">
        <Container className="px-4">
          <div className="max-w-xl mx-auto">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                className={`relative rounded-2xl overflow-hidden border ${
                  pkg.popular
                    ? "border-yellow-300 shadow-xl"
                    : "border-gray-200 shadow-lg"
                } transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div
                  className={`p-6 ${pkg.popular ? "bg-gradient-to-br from-yellow-50 to-yellow-100" : "bg-white"}`}
                >
                  <h3 className="text-2xl font-bold mb-1 text-black">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.tagline}</p>
                  <div className="mb-6">
                    <span className="text-gray-500 line-through text-lg">
                      ₹{pkg.originalPrice}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-600">
                        ₹{pkg.discountedPrice}
                      </span>
                      <span className="text-gray-600">+GST</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Valid till {pkg.validTill}
                    </p>
                  </div>
                  <Button
                    className={`w-full py-6 h-auto text-base ${
                      pkg.popular
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800"
                    } font-medium shadow-md`}
                  >
                    Purchase Now
                  </Button>
                </div>
                <div className="p-6 border-t border-gray-200 pb-8 bg-white">
                  <h4 className="font-bold mb-4 text-black">Key Features</h4>
                  <ul className="space-y-4">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {feature.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Our Packages */}
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-color-form-background">
        <Container className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our packages are designed to provide comprehensive support
              throughout your NEET counselling journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Get personalized support from experienced counsellors to
                navigate NEET counselling and admission processes confidently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Accurate & Timely Information
              </h3>
              <p className="text-gray-600">
                Access verified, up-to-date information and real-time updates on
                colleges, cutoffs, and counselling schedules.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Strategic Approach
              </h3>
              <p className="text-gray-600">
                Learn proven strategies for choice filling and seat selection to
                maximize your chances of securing your dream college.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-color-background">
        <Container className="px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our counselling packages
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 py-5">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-color-text">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                <div
                  className={`mt-2 text-gray-600 transition-all duration-300 overflow-hidden ${
                    expandedFaq === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="pb-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </FELayout>
  )
}

