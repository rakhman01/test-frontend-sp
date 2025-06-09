import { cn } from "@/app/lib/utils"
import type React from "react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "away" | "busy"
  initials?: string
}

export const Avatar = ({ className, src, alt = "Avatar", size = "md", status, initials, ...props }: AvatarProps) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  }

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  }

  const statusSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-4 w-4",
  }

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {src ? (
        <img src={src || "/placeholder.svg"} alt={alt} className={cn("rounded-full object-cover", sizes[size])} />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium",
            sizes[size],
          )}
        >
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusClasses[status],
            statusSizes[size],
          )}
        />
      )}
    </div>
  )
}
