'use client'
import { useRouter } from "next/navigation"

export function BlogFooter() {
  const navigation = useRouter()
    return (
      <footer className="bg-blue-600 text-white py-6">
        <div  className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center cursor-pointer">
          <div onClick={() => navigation.push('/')} className="flex items-center mb-4 md:mb-0 cursor-pointer">
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="white" />
              <path
                d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold">LogoIpsum</span>
          </div>
          <div className="text-sm text-blue-200">© 2025 LogoIpsum. All rights reserved.</div>
        </div>
      </footer>
    )
  }
  