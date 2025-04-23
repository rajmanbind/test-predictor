import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { CollegePredictorForm } from "@/components/frontend/college-predictor/CollegePredictorForm"
import { CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <FELayout>
      <Container className="py-16 pc:py-20 relative">
        <div className="absolute top-0 min-h-dvh inset-0 bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 -z-10 py-16 pc:py-20"></div>
        <div className="grid pc:grid-cols-[45%_55%] gap-6">
          <div className="flex h-full items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200">
                NEET College Predictor {new Date().getFullYear()}
              </div>

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Your Ultimate Guide to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                  NEET Counselling
                </span>
              </h1>

              <p className="text-color-subtext max-w-[600px] leading-relaxed tab:text-2xl opacity-80">
                Make college selection easier by estimating potential colleges
                based on NEET UG ranks. Get detailed insights into admission
                criteria and counselling developments.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-color-accent" />
                  <span className="text-sm font-medium">
                    Accurate Predictions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-color-accent" />
                  <span className="text-sm font-medium">3,000+ Colleges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-color-accent" />
                  <span className="text-sm font-medium">Expert Guidance</span>
                </div>
              </div>
            </div>
          </div>

          <CollegePredictorForm />
        </div>
      </Container>
    </FELayout>
  )
}
