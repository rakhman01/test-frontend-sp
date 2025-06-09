"use client"

import type React from "react"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"
import { cn } from "@/app/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error"
  title?: string
  onClose?: () => void
  icon?: React.ReactNode
}

export const Alert = ({ className, variant = "info", title, children, onClose, icon, ...props }: AlertProps) => {
  const variants = {
    info: {
      containerClass: "bg-blue-50 border-blue-200 text-blue-800",
      iconClass: "text-blue-500",
      defaultIcon: <Info className="h-5 w-5" />,
    },
    success: {
      containerClass: "bg-green-50 border-green-200 text-green-800",
      iconClass: "text-green-500",
      defaultIcon: <CheckCircle className="h-5 w-5" />,
    },
    warning: {
      containerClass: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClass: "text-yellow-500",
      defaultIcon: <AlertTriangle className="h-5 w-5" />,
    },
    error: {
      containerClass: "bg-red-50 border-red-200 text-red-800",
      iconClass: "text-red-500",
      defaultIcon: <AlertCircle className="h-5 w-5" />,
    },
  }

  const currentVariant = variants[variant]

  return (
    <div
      className={cn("rounded-md border p-4 flex items-start", currentVariant.containerClass, className)}
      role="alert"
      {...props}
    >
      {(icon || currentVariant.defaultIcon) && (
        <div className={cn("flex-shrink-0 mr-3 mt-0.5", currentVariant.iconClass)}>
          {icon || currentVariant.defaultIcon}
        </div>
      )}
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
        {children && <div className="text-sm">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className={cn("ml-3 flex-shrink-0 -mt-0.5 -mr-0.5", currentVariant.iconClass)}
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
