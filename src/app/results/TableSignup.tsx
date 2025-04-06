import { ChevronRight } from "lucide-react"

interface TableSignupProps {
  totalRecords: number
}

function TableSignup({ totalRecords }: TableSignupProps) {
  console.log("totalRecords", totalRecords)

  return (
    <div className="h-52 bg-[#ecbc00] sticky left-0">
      <div className="h-full w-full grid place-items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-white text-center flex flex-col gap-2 justify-center items-center">
          <h2 className="text-[26px] font-medium">
            + {totalRecords} More Options
          </h2>

          <p className="text-lg">
            Get access to over 30 states' counseling dates, colleges, courses,
            fees, cut-offs, and much more.
          </p>

          <button className="flex items-center gap-2 bg-black px-3 pl-5 py-3 mt-4 hover:bg-black/90 hover:border-white border-[2px] border-transparent box-border transition-all">
            Sign Up Now <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableSignup
