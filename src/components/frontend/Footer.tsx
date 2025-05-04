import Link from "next/link"

import { Container } from "./Container"

export function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 bg-gray-900 text-gray-200">
      <Container className="px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600 font-bold text-black shadow-md">
                CE
              </div>
              <span className="text-xl font-bold text-white">
                Career<span className="text-yellow-500">Edwise</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Making medical education choices simpler and smarter for NEET
              aspirants across India.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <div
                  className="text-gray-400 hover:text-white transition-colors"
                  data-tooltip-id="tooltip"
                  data-tooltip-content={`Coming Soon 🎉`}
                >
                  College Predictor
                </div>
              </li>
              <li>
                <div
                  className="text-gray-400 hover:text-white transition-colors"
                  data-tooltip-id="tooltip"
                  data-tooltip-content={`Coming Soon 🎉`}
                >
                  Closing Ranks
                </div>
              </li>
              <li>
                <div
                  className="text-gray-400 hover:text-white transition-colors"
                  data-tooltip-id="tooltip"
                  data-tooltip-content={`Coming Soon 🎉`}
                >
                  Counselling
                </div>
              </li>
              <li>
                <div
                  className="text-gray-400 hover:text-white transition-colors"
                  data-tooltip-id="tooltip"
                  data-tooltip-content={`Coming Soon 🎉`}
                >
                  College Comparison
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 mt-0.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:collegecutoff.net@gmail.com"
                  className="text-gray-400"
                >
                  collegecutoff.net@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 mt-0.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+919028009835" className="text-gray-400">
                  +91 9028009835
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © 2025 CollegeCutOff. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
