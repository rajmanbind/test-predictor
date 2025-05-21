"use client"

import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { CheckCircle, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

export default function ContactUsContent() {
  return (
    <FELayout>
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-20 blur-3xl -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 blur-3xl -z-10"></div>

        <Container>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
              GET IN TOUCH
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-black">
              Contact Us
            </h1>
            <p className="text-gray-600 md:text-lg mb-8 max-w-2xl">
              {`Have questions about NEET counselling or need guidance for your
              medical career? We're here to help you every step of the way.`}
            </p>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="w-full py-12 md:py-16 bg-color-background">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About CollegeCutoff
              </h2>
              <p className="text-gray-600 mb-4">
                {`CollegeCutoff is India's leading platform dedicated to helping
                NEET aspirants make informed decisions about their medical
                education journey. Founded in 2017, we have guided over 30,000
                students to secure admissions in their dream medical colleges.`}
              </p>
              <p className="text-gray-600 mb-4">
                Our team consists of experienced counsellors, medical
                professionals, and education experts who understand the
                complexities of NEET counselling and admission processes across
                India.
              </p>
              <p className="text-gray-600 mb-6">
                We pride ourselves on providing accurate, up-to-date information
                and personalized guidance to help students navigate the
                challenging path to becoming medical professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">8+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">30,000+ Students Guided</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">500+ Medical Colleges</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-yellow-100 to-emerald-100 rounded-3xl transform rotate-3 scale-105 opacity-70"></div>
              <div className="bg-color-form-background p-6 md:p-8 rounded-2xl shadow-lg">
                <img
                  src="/medical-education-counselling-team.png"
                  alt="CollegeCutoff Team"
                  className="w-full h-auto rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To simplify medical education choices and empower NEET
                  aspirants with accurate information and personalized guidance
                  to achieve their career goals.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Information & Urgent Help Section */}
      <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-color-form-background">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="relative pt-10 md:pt-0">
                <h2 className="text-2xl font-bold mb-6 absolute md:relative top-0 left-0">
                  Contact Information
                </h2>
                <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100 mt-4 md:mt-1">
                  <div className="space-y-6 md:space-y-8 py-3">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                        <Mail className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-gray-900">
                          Email Us
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                          For counselling:
                        </p>
                        <a
                          href="mailto:collegecutoff.net@gmail.com"
                          className="text-yellow-600 hover:underline font-medium text-sm md:text-base"
                        >
                          collegecutoff.net@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-gray-900">
                          Call Us
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                          Counselling Helpline:
                        </p>
                        <a
                          href="tel:+919028009835"
                          className="text-yellow-600 hover:underline font-medium text-sm md:text-base"
                        >
                          +91 9028009835
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                        <MapPin className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-gray-900">
                          Visit Us
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">
                          302, Pyramid Axis, Baner,
                          <br />
                          411045, Pune Maharashtra,
                          <br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Urgent Help - Redesigned */}
              <div className="relative pt-10 md:pt-0">
                <h2 className="text-2xl font-bold mb-6 absolute md:relative top-0 left-0">
                  Need Urgent Help?
                </h2>
                <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl shadow-xl overflow-hidden mt-4 md:mt-1">
                  <div className="relative p-5 md:p-[34px]">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 text-white">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                        Get Immediate Assistance
                      </h3>
                      <p className="mb-5 md:mb-6 opacity-90 text-sm md:text-base">
                        Our expert counsellors are available to provide
                        immediate guidance for your NEET counselling queries and
                        college selection decisions.
                      </p>

                      <div className="space-y-4 md:space-y-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                              <Phone className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">
                                Call Our Priority Helpline
                              </h4>
                              <a
                                href="tel:+919876543211"
                                className="text-white font-bold text-base md:text-lg hover:underline"
                              >
                                +91 9876543211
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">
                                WhatsApp Support
                              </h4>
                              <a
                                href="https://wa.me/919876543211"
                                className="text-white font-bold text-base md:text-lg hover:underline"
                              >
                                +91 9876543211
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </FELayout>
  )
}

