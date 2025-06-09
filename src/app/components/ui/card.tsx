import type React from "react"
import { cn } from "@/app/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated"
}

export const Card = ({ className, variant = "default", ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-white",
        variant === "bordered" && "border border-gray-200",
        variant === "elevated" && "shadow-md",
        variant === "default" && "shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return <div className={cn("px-6 py-5 border-b border-gray-100", className)} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = ({ className, ...props }: CardTitleProps) => {
  return <h3 className={cn("text-lg font-medium text-gray-900", className)} {...props} />
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
  return <p className={cn("text-sm text-gray-500 mt-1", className)} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className, ...props }: CardContentProps) => {
  return <div className={cn("px-6 py-5", className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return <div className={cn("px-6 py-4 bg-gray-50 rounded-b-lg", className)} {...props} />
}
