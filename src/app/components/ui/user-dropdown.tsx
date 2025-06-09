"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { LogoutModal } from "./logout-modal"
import JwtService from "@/app/lib/JwtService"
import { useRouter } from "next/navigation"

interface UserDropdownProps {
  userName: string
  userInitial: string
}

export function UserDropdown({ userName, userInitial }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigaiton = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogoutClick = () => {
    setIsOpen(false)
    setShowLogoutModal(true)
 
  }

  const handleLogoutConfirm = () => {
    // Handle actual logout logic here
    console.log("User logged out")
    setShowLogoutModal(false)
    JwtService.destroyToken()
    JwtService.destroyAuth()
   navigaiton.push('/login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-blue-700 rounded-full px-3 py-1 hover:bg-blue-800 transition-colors"
        >
          <div className="h-6 w-6 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
            {userInitial}
          </div>
          <span className="text-sm text-white">{userName}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              My Account
            </Link>

            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-500" />
              Log out
            </button>
          </div>
        )}
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
    </>
  )
}
