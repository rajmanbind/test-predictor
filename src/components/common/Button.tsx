import { cn } from "@/utils/utils"

export function Button({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-color-accent hover:bg-color-accent-dark disabled:bg-color-disabled-bg disabled:text-color-disabled-text px-4 py-3 rounded text-white",
        className,
      )}
    >
      {children}
    </button>
  )
}
