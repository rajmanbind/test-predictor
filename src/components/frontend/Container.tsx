import { cn } from "@/utils/utils"
import { HTMLAttributes, ReactNode } from "react"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-3 sm:px-8", className)} {...props}>
      {children}
    </div>
  )
}
