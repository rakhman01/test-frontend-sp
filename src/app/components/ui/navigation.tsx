"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/app/lib/utils"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  logo?: React.ReactNode
  items?: {
    label: string
    href: string
    active?: boolean
  }[]
  actions?: React.ReactNode
  className?: string
}

export const Navigation = ({ logo, items = [], actions, className }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={cn("bg-white shadow", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {logo && <div className="flex-shrink-0 flex items-center">{logo}</div>}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    item.active
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">{actions}</div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  item.active
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          {actions && <div className="pt-4 pb-3 border-t border-gray-200 px-4">{actions}</div>}
        </div>
      )}
    </nav>
  )
}
