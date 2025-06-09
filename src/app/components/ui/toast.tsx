"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/app/lib/utils"

export interface Toast {
  id: string
  title?: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { ...toast, id }

      setToasts((prev) => [...prev, newToast])

      // Auto remove toast after duration
      const duration = toast.duration || 5000
      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast],
  )

  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "success", message, title })
    },
    [addToast],
  )

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "error", message, title })
    },
    [addToast],
  )

  const warning = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "warning", message, title })
    },
    [addToast],
  )

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "info", message, title })
    },
    [addToast],
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast()

  const variants = {
    success: {
      containerClass: "bg-green-50 border-green-200 text-green-800",
      iconClass: "text-green-500",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    error: {
      containerClass: "bg-red-50 border-red-200 text-red-800",
      iconClass: "text-red-500",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    warning: {
      containerClass: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClass: "text-yellow-500",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      containerClass: "bg-blue-50 border-blue-200 text-blue-800",
      iconClass: "text-blue-500",
      icon: <Info className="h-5 w-5" />,
    },
  }

  const variant = variants[toast.type]

  return (
    <div
      className={cn(
        "rounded-md border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
        variant.containerClass,
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className={cn("flex-shrink-0 mr-3", variant.iconClass)}>{variant.icon}</div>
        <div className="flex-1 min-w-0">
          {toast.title && <h3 className="text-sm font-medium mb-1">{toast.title}</h3>}
          <p className="text-sm">{toast.message}</p>
        </div>
        <button
          type="button"
          className={cn("ml-3 flex-shrink-0 -mt-0.5 -mr-0.5 p-1 rounded-md hover:bg-black/5", variant.iconClass)}
          onClick={() => removeToast(toast.id)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
