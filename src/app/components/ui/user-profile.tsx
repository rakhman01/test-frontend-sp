"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import http from "@/app/lib/ApiService"

export interface User {
  id: string
  username: string
  role: 'User' | 'Admin' | string
  createdAt: string
  updatedAt: string
}


export function UserProfile() {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Get main article
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



  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
      </div>

      <div className="flex justify-center mb-8">
        <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-medium">
          J
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <div className="w-1/3 py-3 px-4 text-gray-700 font-medium">Username</div>
          <div className="w-2/3 py-3 px-4 bg-gray-50 text-black">{data?.username}</div>
        </div>

        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <div className="w-1/3 py-3 px-4 text-gray-700 font-medium">Password</div>
          <div className="w-2/3 py-3 px-4 bg-gray-50 flex justify-between items-center text-black">
            {showPassword ? data?.username : "••••••••"}
            <button
              disabled
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <div className="w-1/3 py-3 px-4 text-gray-700 font-medium">Role</div>
          <div className="w-2/3 py-3 px-4 bg-gray-50 text-black">{data?.role}</div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
