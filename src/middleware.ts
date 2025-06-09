import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  const { pathname } = request.nextUrl

  // If already logged in and trying to access /login, redirect to appropriate dashboard
  if (token && pathname === '/login') {
    if (role === 'Admin') {
      return NextResponse.redirect(new URL('/admin/articles', request.url))
    } else if (role === 'User') {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url)) // fallback
    }
  }

  //  If not logged in, redirect to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && role !== 'Admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (!pathname.startsWith('/admin') && role !== 'User') {
    return NextResponse.redirect(new URL('/admin/articles', request.url))
  }

  return NextResponse.next()
}

//  Add matcher to include /login
export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/', '/articles/:path*', '/login'],
}
