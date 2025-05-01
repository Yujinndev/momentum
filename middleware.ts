import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { auth, nextUrl } = req

  if (nextUrl.pathname === '/') return

  // If not authenticated and not on signin page, redirect to signin
  if (!auth && nextUrl.pathname !== '/auth/signin') {
    const newUrl = new URL('/auth/signin', nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // If authenticated but needs onboarding and not on onboarding page
  if (
    auth &&
    auth.user.onboardingCompleted === false &&
    !nextUrl.pathname.includes('/onboarding')
  ) {
    const newUrl = new URL('/auth/onboarding', nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // If authenticated and on signin page, redirect to dashboard
  if (auth && nextUrl.pathname === '/auth/signin') {
    const newUrl = new URL('/dashboard', nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // If authenticated, completed onboarding, but trying to access onboarding page
  if (
    auth &&
    auth.user.onboardingCompleted === true &&
    nextUrl.pathname.startsWith('/onboarding')
  ) {
    const newUrl = new URL('/dashboard', nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
