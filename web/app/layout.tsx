import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Rubik } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/app/providers'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Momentum - Your Personal Finance, Habit, and Life Goal Tracker',
  description:
    'Momentum is your all-in-one app for managing finances, tracking habits, and achieving life goals. Gain clarity, build better habits, and take charge of your personal and financial growth with Momentum.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen', rubik.className)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
