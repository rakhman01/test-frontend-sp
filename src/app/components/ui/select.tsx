"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/app/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  error?: boolean
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    { options, value, placeholder = "Select an option", onValueChange, disabled = false, className, error = false },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value || "")
    const selectRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((option) => option.value === selectedValue)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue)
      setIsOpen(false)
      onValueChange?.(optionValue)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault()
          setIsOpen(!isOpen)
          break
        case "Escape":
          setIsOpen(false)
          break
        case "ArrowDown":
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            const currentIndex = options.findIndex((option) => option.value === selectedValue)
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
            const nextOption = options[nextIndex]
            if (nextOption && !nextOption.disabled) {
              handleSelect(nextOption.value)
            }
          }
          break
        case "ArrowUp":
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            const currentIndex = options.findIndex((option) => option.value === selectedValue)
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
            const prevOption = options[prevIndex]
            if (prevOption && !prevOption.disabled) {
              handleSelect(prevOption.value)
            }
          }
          break
      }
    }

    return (
      <div className="relative" ref={selectRef}>
        <button
          ref={ref}
          type="button"
          className={cn(
            "relative w-full h-12 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className,
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="select-label"
        >
          <span className={cn("block truncate text-black", !selectedOption && "text-gray-900")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                isOpen && "transform rotate-180",
              )}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1" role="listbox">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-50 text-black",
                    option.disabled && "cursor-not-allowed opacity-50",
                    selectedValue === option.value && "bg-blue-50 text-blue-900",
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  role="option"
                  aria-selected={selectedValue === option.value}
                >
                  <span className={cn("block truncate", selectedValue === option.value && "font-medium")}>
                    {option.label}
                  </span>
                  {selectedValue === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = "Select"

// Simplified API components for easier usage
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectValueProps {
  placeholder?: string
}

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <span className="text-gray-900">{placeholder}</span>
}

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export const SelectContent = ({ children, className }: SelectContentProps) => {
  return (
    <div
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95",
        className,
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

export interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export const SelectItem = ({ value, children, disabled, className }: SelectItemProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      data-value={value}
      data-disabled={disabled}
    >
      {children}
    </div>
  )
}
