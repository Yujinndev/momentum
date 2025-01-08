import { type LucideIcon, SquareTerminal, ReceiptText } from 'lucide-react'

type Navigation = {
  name: string
  description: string
  url: string
  icon: LucideIcon
}

export const NAVIGATIONS: Navigation[] = [
  {
    name: 'Dashboard',
    description: 'Keep track, Assess, and Enhance your financial momentum',
    url: '/dashboard',
    icon: SquareTerminal,
  },
  {
    name: 'Transactions',
    description:
      'Stay informed and in control of your spending and income history.',
    url: '/transactions',
    icon: ReceiptText,
  },
]
