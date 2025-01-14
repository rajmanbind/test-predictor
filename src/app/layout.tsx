import { cn } from "@/utils/utils"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Poppins } from "next/font/google"

import "../styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
    <html lang="en" className="scroll-smooth">
      <body className={cn(poppins.variable, "antialiased bg-color-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
