import Link from "next/link"
import { UserDropdown } from "./user-dropdown"

export function ProfileHeader() {
  return (
    <header className="w-full border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#2563EB" />
            <path
              d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-semibold text-gray-900">LogoIpsum</span>
        </Link>
        <UserDropdown userName="James Dean" userInitial="J" />
      </div>
    </header>
  )
}
