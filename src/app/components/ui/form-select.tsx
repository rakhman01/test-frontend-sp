"use client"

import React from "react"
import { Select, type SelectOption } from "./select"
import { cn } from "@/app/lib/utils"

export interface FormSelectProps {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  value?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  id?: string
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      value,
      placeholder = "Select an option",
      onValueChange,
      disabled = false,
      required = false,
      className,
      id,
    },
    ref,
  ) => {
    const hasError = !!error

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Select
          ref={ref}
          options={options}
          value={value}
          placeholder={placeholder}
          onValueChange={onValueChange}
          disabled={disabled}
          error={hasError}
        />
        {(error || helperText) && (
          <p className={cn("mt-1 text-sm", hasError ? "text-red-600" : "text-gray-500")}>{error || helperText}</p>
        )}
      </div>
    )
  },
)

FormSelect.displayName = "FormSelect"
