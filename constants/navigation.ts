import { type LucideIcon, SquareTerminal, ReceiptText } from 'lucide-react'

type Navigation = {
  name: string
  description: string
  url: string
  icon: LucideIcon
}

export const NAVIGATION_MENU: Navigation[] = [
  {
    name: 'Dashboard',
    description: 'Keep track, Assess, and Enhance your financial momentum',
    url: '/dashboard',
    icon: SquareTerminal,
  },
  {
    name: 'Transactions',
    description: 'Check your transaction history',
    url: '/dashboard/transactions',
    icon: ReceiptText,
  },
]
