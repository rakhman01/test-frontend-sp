"use client"

import { useEffect } from "react"
import { UIButton } from "./ui-button"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="text-start">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Logout</h2>
          <p className="text-gray-600 mb-6">Are you sure want to logout?</p>

          <div className="flex gap-3 justify-end">
            <UIButton variant="outline" onClick={onClose} className="px-6">
              Cancel
            </UIButton>
            <UIButton onClick={onConfirm} className="px-6 bg-blue-600 hover:bg-blue-700">
              Logout
            </UIButton>
          </div>
        </div>
      </div>
    </div>
  )
}
