import {
  type LucideIcon,
  SquareTerminal,
  ReceiptText,
  User,
} from 'lucide-react'

type Navigation = {
  name: string
  description: string
  url: string
  icon: LucideIcon
  isVisible: boolean
}

export const NAVIGATIONS: Navigation[] = [
  {
    name: 'Dashboard',
    description: 'Keep track, Assess, and Enhance your financial momentum',
    url: '/dashboard',
    icon: SquareTerminal,
    isVisible: true,
  },
  {
    name: 'Transactions',
    description:
      'Stay informed and in control of your spending and income history.',
    url: '/transactions',
    icon: ReceiptText,
    isVisible: true,
  },
  {
    name: 'Account Settings',
    description:
      'Stay informed and in control of your spending and income history.',
    url: '/account',
    icon: User,
    isVisible: false,
  },
]
