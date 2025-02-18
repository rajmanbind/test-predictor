import { type NextRequest, NextResponse } from "next/server"

import { getUserSession, updateSession } from "./lib/supabase"

export async function middleware(request: NextRequest) {
  const response = updateSession(request)
  const user = await getUserSession()

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin/") && !user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (user && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
