import type React from "react"
import { cn } from "@/app/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

export const Badge = ({ className, variant = "default", size = "md", ...props }: BadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    outline: "bg-transparent border border-gray-300 text-gray-700",
  }

  const sizes = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-xs px-2.5 py-0.5 rounded",
    lg: "text-sm px-3 py-1 rounded-md",
  }

  return (
    <span
      className={cn("inline-flex items-center font-medium", variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
