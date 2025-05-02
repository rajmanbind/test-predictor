import { CheckCircle } from "lucide-react"
import Link from "next/link"
import React from "react"

import { CollegePredictorForm } from "../college-predictor/CollegePredictorForm"

export function Hero() {
  return (
    <div className="grid pc:grid-cols-[45%_55%] gap-6">
      <div className="flex h-full items-center">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200">
            NEET College Predictor {new Date().getFullYear()}
          </div>

          <h1 className="text-3xl font-bold tab:text-4xl pc:text-5xl">
            {`CollegeCutoff.net — Your First Step Towards`}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-accent to-color-accent-dark">
              {` Private Medical Admissions`}
            </span>
          </h1>

          <p className="text-color-subtext max-w-[600px] leading-relaxed tab:text-[22px] opacity-80">
            {`Choosing the right medical college is one of the biggest decisions —
            and one mistake can cost you a valuable seat. At`}{" "}
            <Link
              href={"https://collegecutoff.net"}
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              CollegeCutoff.net
            </Link>
            {`,
            we help you eliminate the guesswork with clear, accurate, last
            year's cutoff data for private and deemed universities, college-wise
            and category-wise — for both MBBS and MD/MS programs.`}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-base font-medium">
                Accurate Predictions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-base font-medium">3,000+ Colleges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-base font-medium">Expert Guidance</span>
            </div>
          </div>
        </div>
      </div>

      <CollegePredictorForm />
    </div>
  )
}
