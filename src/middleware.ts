import { type NextRequest, NextResponse } from "next/server"

import { getUserSession, updateSession } from "./lib/supabase"

export async function middleware(request: NextRequest) {
  let response = updateSession(request)
  const user = await getUserSession()

  const { pathname } = request.nextUrl

  if (user && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
