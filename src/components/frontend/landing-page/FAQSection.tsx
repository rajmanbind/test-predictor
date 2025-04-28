"use client"

import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { useState } from "react"

type FAQItemProps = {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  isDarkMode: boolean
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  isDarkMode,
}: FAQItemProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden mb-4 transition-all duration-200 ${isOpen ? "shadow-md" : ""} ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <button
        className={`flex justify-between items-center w-full text-left p-5 ${
          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
        }`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3
          className={`font-medium text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {question}
        </h3>
        <div
          className={`flex-shrink-0 ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div
          className={`p-5 border-t ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}
        >
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How accurate is the college predictor?",
      answer:
        "Our college predictor is highly accurate with a 95% success rate. It uses historical data from previous years' counseling rounds, current trends, and sophisticated algorithms to provide the most accurate predictions possible. We update our database regularly to ensure you get the most reliable information.",
    },
    {
      question: "What information do I need to use the college predictor?",
      answer:
        "To use our college predictor, you'll need your NEET rank, state of domicile, category (General/OBC/SC/ST/EWS), and preferred course. The more information you provide, the more accurate our predictions will be. You can also specify preferences like location or specific colleges to refine your results.",
    },
    {
      question: "How does the counselling process work?",
      answer:
        "The NEET counselling process typically involves registration, fee payment, choice filling, seat allotment, and reporting to the allotted college. Our experts guide you through each step, help you with strategic choice filling based on your rank and preferences, and provide support until you secure admission.",
    },
    {
      question: "What is included in the premium plan?",
      answer:
        "Our premium plan includes full access to our college database with detailed insights, personalized one-on-one counselling sessions with medical education experts, mock counselling sessions to practice your strategy, and comprehensive career planning tools. Premium members also get priority support and exclusive webinars with admission experts.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a 7-day money-back guarantee if you're not satisfied with our premium services. If you feel our services didn't meet your expectations, you can request a refund within 7 days of purchase. Please contact our support team to process your refund.",
    },
    {
      question: "How do I contact support if I have questions?",
      answer:
        "You can reach our support team via email at support@CollegeCutOff.com, through the live chat on our website, or by calling our helpline at +91 9876543210. Our support team is available 24/7 to assist you with any queries or concerns you may have.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <section className={`w-full py-16 md:py-24 transition-colors duration-300`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div
            className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium shadow-sm border bg-yellow-100 text-yellow-800 border-yellow-200`}
          >
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl`}
          >
            Frequently Asked Questions by the students
          </h2>
          <p
            className={`max-w-[900px] md:text-xl/relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Find answers to commonly asked questions about our college predictor
            and counselling services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid gap-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
