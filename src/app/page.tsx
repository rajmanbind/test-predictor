"use client"

import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { CollegePredictorForm } from "@/components/frontend/college-predictor/CollegePredictorForm"

export default function Home() {
  return (
    <FELayout>
      <Container className="py-16 pc:py-20">
        <h1 className="text-[26px] tab:text-4xl font-semibold text-color-text pb-10 tab:pb-20 pc:hidden">
          NEET College Predictor
        </h1>

        <div className="grid pc:grid-cols-[45%_55%] gap-6">
          <div className="order-2 pc:order-none">
            <h1 className="text-2xl pc:text-3xl font-semibold text-color-text py-6">
              <p className="pc:hidden pt-2 tab:pt-12">
                {`Career Edwise's NEET College Predictor`}
              </p>

              <p className="hidden pc:block">NEET College Predictor</p>
            </h1>

            <p className="text-color-subtext max-w-[600px] leading-relaxed">
              {`
              Career Edwise's NEET College Predictor makes college selection
              easier by estimating potential colleges based on NEET UG 
              ${new Date().getFullYear()} ranks. It provides detailed insights
              into admission criteria and keeps you updated on the latest
              counselling developments, ensuring a smoother admission process.
              By leveraging data from previous year's results, Career Edwise's
              tool empowers candidates to evaluate institutes effectively and
              plan their NEET UG ${new Date().getFullYear()} counselling journey
              with confidence. Not only does Career Edwise's NEET College
              Predictor estimate potential colleges, but it also highlights the
              unique strengths and specializations of each institution. By
              analyzing past trends and cutoff scores, the tool offers a
              realistic perspective on college options, helping candidates set
              their priorities and make well-informed decisions about their
              future.
              `}
            </p>
          </div>

          <CollegePredictorForm />
        </div>
      </Container>
    </FELayout>
  )
}
