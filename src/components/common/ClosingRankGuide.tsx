import React, { ReactNode } from "react"

const data = [
  {
    term: "CR",
    description: `refers to Closing Rank — "the rank of the last
                             candidate who secured a seat in a particular medical college
                             under a specific quota".`,
  },
  {
    term: "SR",
    description: `refers to Stray Round.`,
  },
  {
    term: "Allotted Category",
    description:
      "refers to the category under which a candidate is offered a seat during counselling.",
  },
  {
    term: "NA",
    description: `refers to No Allotment or No Seat Left for that round.`,
  },
]

export function ClosingRankGuide() {
  return (
    <div className="border border-color-border p-4 rounded-md text-color-text">
      <h2 className="font-medium text-lg mb-2">Key Terms</h2>

      <div className="flex flex-col gap-3 text-sm text-color-text">
        {data.map((item) => (
          <div key={item.term} className="flex flex-col tab:flex-row gap-2">
            <Badge>{item.term}</Badge>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="font-medium border border-color-border rounded-[20px] px-2 flex-shrink-0 h-[23px] w-fit grid place-items-center">
      {children}
    </div>
  )
}
