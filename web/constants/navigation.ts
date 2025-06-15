import {
  type LucideIcon,
  SquareTerminal,
  ReceiptText,
  PiggyBank,
} from 'lucide-react'

type Navigation = {
  name: string
  description: string
  url: string
  icon: LucideIcon
  isVisible: boolean
}

type GroupNavigation = {
  label: string
  items: Navigation[]
}

export const NAVIGATIONS: GroupNavigation[] = [
  {
    label: 'Menu',
    items: [
      {
        name: 'Dashboard',
        description: 'Keep track, Assess, and Enhance your financial momentum',
        url: '/dashboard',
        icon: SquareTerminal,
        isVisible: true,
      },
    ],
  },
  {
    label: 'Finance',
    items: [
      {
        name: 'Transactions',
        description:
          'Stay informed and in control of your spending and income history.',
        url: '/finance',
        icon: ReceiptText,
        isVisible: true,
      },
      {
        name: 'Savings',
        description:
          'Stay informed and in control of your spending and income history.',
        url: '/savings',
        icon: PiggyBank,
        isVisible: true,
      },
    ],
  },
]
