"use client"

import { cn } from "@/utils/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { DollarSign } from "lucide-react"
import * as React from "react"

interface FeeRangeSliderProps {
  className?: string
}

export function FeeRangeSlider({ className }: FeeRangeSliderProps) {
  const [range, setRange] = React.useState<[number, number]>([0, 10000000])

  const handleSliderChange = (newValue: number[]) => {
    setRange([newValue[0], newValue[1]])
  }

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 10000000) {
        const newRange: [number, number] = [...range] as [number, number]
        newRange[index] = newValue

        // Ensure from value doesn't exceed to value and vice versa
        if (index === 0 && newValue > range[1]) {
          newRange[0] = range[1]
        } else if (index === 1 && newValue < range[0]) {
          newRange[1] = range[0]
        } else {
          newRange[index] = newValue
        }

        setRange(newRange)
      }
    }

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {/* <Label htmlFor="feeFrom">From</Label> */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              id="feeFrom"
              type="number"
              min={0}
              max={10000000}
              value={range[0]}
              onChange={handleInputChange(0)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatValue(range[0])}
          </p>
        </div>
        <div className="space-y-2">
          {/* <Label htmlFor="feeTo">To</Label> */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              id="feeTo"
              type="number"
              min={0}
              max={10000000}
              value={range[1]}
              onChange={handleInputChange(1)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatValue(range[1])}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Slider
          min={0}
          max={10000000}
          step={1000}
          value={range}
          onValueChange={handleSliderChange}
          className="py-6"
        />
        <p className="text-sm text-muted-foreground text-center">
          Range: {formatValue(range[1] - range[0])}
        </p>
      </div>
    </div>
  )
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-accent" />
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-primary hover:bg-accent" />
  </SliderPrimitive.Root>
))
