"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/app/lib/utils"
import { FileText, Tag, LogOut } from "lucide-react"
import JwtService from "@/app/lib/JwtService"
import { useEffect, useState } from "react"
import { LogoutModal } from "./logout-modal"
import { User } from "./user-profile"
import http from "@/app/lib/ApiService"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const navigaitons = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)



  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }


  const navigation = [
    {
      name: "Articles",
      href: "/admin/articles",
      icon: FileText,
      current: pathname === "/admin",
    },
    {
      name: "Category",
      href: "/admin/category",
      icon: Tag,
      current: pathname === "/admin/category",
    },

  ]

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
    navigaitons.push('/login')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await http.get(`/auth/profile`)
      setData(res.data)
    } catch (err) {
      console.error("Failed to fetch article:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(data);
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="white" />
              <path
                d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">LogoIpsum</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      item.current ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700 hover:text-white",
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
            <li>
              <button
                onClick={() => {
                  handleLogoutClick()
                }}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  false ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700 hover:text-white",
                )}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <div onClick={() => navigaitons.push('/profile')} className="flex items-center cursor-pointer">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-xs">
                  {data?.username.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{data?.username}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
        
              <LogoutModal isOpen={showLogoutModal} onClose={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
      </div>
    </div>
  )
}
