import { cn } from "@/utils/utils"

export function Button({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "bg-color-accent hover:bg-color-accent-dark px-4 py-3 rounded text-white",
        className,
      )}
    >
      {children}
    </button>
  )
}
