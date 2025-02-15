import { cn } from "@/utils/utils"

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border bg-white p-4 shadow-sm", className)}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-full", className)} {...props} />
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between text-sm",
        className,
      )}
      {...props}
    />
  )
}

export function ChartTooltipContent({ indicator }: { indicator: string }) {
  return <div className="flex items-center gap-2">{indicator}</div>
}

export function ChartTooltip({ children }: { children: React.ReactNode }) {
  return <div className="p-2 bg-white border rounded-md shadow">{children}</div>
}

export function ChartContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>
}
