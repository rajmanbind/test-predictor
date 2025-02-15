"use client"

import { format, subDays } from "date-fns"
import React, { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const generateData = (days: number) => {
  return Array.from({ length: days }).map((_, index) => {
    const date = subDays(new Date(), days - 1 - index)
    return {
      date,
      visitors: Math.floor(Math.random() * 1000) + 500,
      subscribers: Math.floor(Math.random() * 500) + 200,
    }
  })
}

const timeRanges = [
  { label: "7 Days", value: 7 },
  { label: "1 Month", value: 30 },
  { label: "All Time", value: 180 },
]

export default function StackedAreaChart() {
  const [selectedRange, setSelectedRange] = useState(30)
  const data = useMemo(() => generateData(selectedRange), [selectedRange])

  return (
    <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Area Chart - Stacked
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing total visitors for the last {selectedRange} days
          </p>
        </div>
        <select
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200"
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84E1BC" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#84E1BC" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FCA5A5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FCA5A5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(new Date(label), "MMM d, yyyy")}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400">
                        Visitors: {payload[0].value}
                      </p>
                      <p className="text-red-400 dark:text-red-300">
                        Subscribers: {payload[1].value}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stackId="1"
              stroke="#34D399"
              fill="url(#colorVisitors)"
            />
            <Area
              type="monotone"
              dataKey="subscribers"
              stackId="1"
              stroke="#F87171"
              fill="url(#colorSubscribers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
