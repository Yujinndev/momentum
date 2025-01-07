import {
  type LucideIcon,
  Banknote,
  Coins,
  CreditCard,
  DollarSign,
  HandCoins,
  Landmark,
  LineChart,
  PhilippinePeso,
  PiggyBank,
  Wallet,
} from 'lucide-react'

type Item = {
  label: string
  value: string
}

type Icon = {
  icon: LucideIcon
}

type ItemWithIcon = Item & Icon
export const CURRENCIES: ItemWithIcon[] = [
  { label: 'Philippine Peso', value: 'PHP', icon: PhilippinePeso },
  { label: 'US Dollar', value: 'USD', icon: DollarSign },
]

export const WALLET_TYPES: ItemWithIcon[] = [
  { label: 'General', value: 'GENERAL', icon: Coins },
  { label: 'Cash', value: 'CASH', icon: Banknote },
  { label: 'Bank', value: 'BANK', icon: Landmark },
  { label: 'E - Wallet', value: 'E_WALLET', icon: Wallet },
  { label: 'Credit Card', value: 'CREDIT_CARD', icon: CreditCard },
  { label: 'Savings Account', value: 'SAVINGS_ACCOUNT', icon: PiggyBank },
  { label: 'Insurance', value: 'INSURANCE', icon: HandCoins },
  { label: 'Investment', value: 'INVESTMENT', icon: LineChart },
]

type ColorScheme = {
  primary: string
  secondary: string
  accent: string
  text: string
  value: string
}

export const WALLET_COLORSCHEMES: ColorScheme[] = [
  {
    primary: 'bg-black',
    secondary: 'bg-neutral-800',
    accent: 'bg-neutral-700',
    text: 'text-white',
    value: 'BLACK',
  },
  {
    primary: 'bg-white',
    secondary: 'bg-neutral-200',
    accent: 'bg-neutral-300',
    text: 'text-black',
    value: 'WHITE',
  },
  {
    primary: 'bg-green-700',
    secondary: 'bg-green-500',
    accent: 'bg-green-300',
    text: 'text-black',
    value: 'GREEN',
  },
  {
    primary: 'bg-red-700',
    secondary: 'bg-red-500',
    accent: 'bg-red-300',
    text: 'text-black',
    value: 'RED',
  },
  {
    primary: 'bg-orange-700',
    secondary: 'bg-orange-500',
    accent: 'bg-orange-300',
    text: 'text-black',
    value: 'ORANGE',
  },
  {
    primary: 'bg-blue-700',
    secondary: 'bg-blue-500',
    accent: 'bg-blue-300',
    text: 'text-black',
    value: 'BLUE',
  },
  {
    primary: 'bg-purple-700',
    secondary: 'bg-purple-500',
    accent: 'bg-purple-300',
    text: 'text-black',
    value: 'PURPLE',
  },
]
