import { cn } from "@/utils/utils"
import Image from "next/image"
import Link from "next/link"

export function Logo({
  className,
  textStyle,
  imgStyle,
}: {
  className?: string
  textStyle?: string
  imgStyle?: string
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        width={62}
        height={62}
        alt="a black background image with written text is CE in yellow color"
        className={cn("rounded-md border border-slate-800 shadow-md", imgStyle)}
        quality={100}
      />
      <div
        className={cn(
          "text-white tracking-wide leading-4 text-[18px]",
          textStyle,
        )}
      >
        <p>College</p>
        <p className="pl-3">CutOff</p>
      </div>
    </Link>
  )
}
