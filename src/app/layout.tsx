import { CoreLayout } from "@/components/common/CoreLayout"
import { cn } from "@/utils/utils"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Roboto } from "next/font/google"
import { Suspense } from "react"

import "../styles/colors.css"
import "../styles/reset.css"
import "../styles/style.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "College Predictor - Career Edwise",
  description: "NEET College Predictor by Career Edwise",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(roboto.variable, "antialiased bg-color-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Suspense fallback={null}>
            <CoreLayout>{children}</CoreLayout>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
