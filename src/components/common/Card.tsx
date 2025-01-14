import { cn } from "@/utils/utils"

export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "bg-color-form-background p-7 tab:p-10 shadow-2xl rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  )
}
