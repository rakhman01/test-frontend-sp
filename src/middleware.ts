import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {  
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  const { pathname } = request.nextUrl

  // If not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && role !== 'Admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/user') && role !== 'User') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}
export const config = {
    matcher: ['/admin/:path*', '/', '/articles/:path*'], 
  }
  