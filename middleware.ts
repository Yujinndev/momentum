import { auth } from '@/auth'

export default auth((req) => {
  const { auth, nextUrl } = req

  if (nextUrl.pathname === '/') return

  if (!auth && nextUrl.pathname !== '/auth/signin') {
    const newUrl = new URL('/auth/signin', nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if (auth && nextUrl.pathname === '/auth/signin') {
    const newUrl = new URL('/dashboard', nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
