import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for the base dashboard path
  if (pathname === '/dashboard') {
    // Determine the default role-specific path
    // TODO: Ideally, determine the actual user role here (e.g., from session, cookie)
    const defaultRolePath = '/dashboard/tutor' // Defaulting to tutor for now

    // Clone the URL and change the pathname
    const url = request.nextUrl.clone()
    url.pathname = defaultRolePath

    console.log(`Middleware: Redirecting ${pathname} to ${url.pathname}`); // For debugging

    // Redirect to the role-specific path
    return NextResponse.redirect(url)
  }

  // Allow other requests to proceed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  // Match only the exact /dashboard path
  matcher: '/dashboard',
} 