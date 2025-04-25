import { Award, BookMarked, Building, Users } from "lucide-react"

export function StatsSection() {
  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Impact in Numbers</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Helping thousands of medical aspirants achieve their dreams
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-500">8+</h3>
            <p className="text-sm text-gray-500 mt-1">Years of experience</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-500">30k+</h3>
            <p className="text-sm text-gray-500 mt-1">Students Registered</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-500">500+</h3>
            <p className="text-sm text-gray-500 mt-1">Colleges Covered</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <BookMarked className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-500">25k+</h3>
            <p className="text-sm text-gray-500 mt-1">Queries Answered</p>
          </div>
        </div>
      </div>
    </section>
  )
}
