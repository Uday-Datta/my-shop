import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function proxy(req) {
  const session = await auth()
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}