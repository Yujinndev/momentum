import { ColorScheme, Choice } from '@/types/choices'
import {
  Banknote,
  Coins,
  CreditCard,
  DollarSign,
  HandCoins,
  Landmark,
  LineChart,
  List,
  PhilippinePeso,
  PieChart,
  PiggyBank,
  ReceiptText,
  Send,
  Wallet,
} from 'lucide-react'

export const CURRENCIES = [
  { label: 'Philippine Peso', value: 'PHP', icon: PhilippinePeso },
  { label: 'US Dollar', value: 'USD', icon: DollarSign },
] satisfies Array<Choice<string>>

export const WALLET_TYPES = [
  { label: 'General', value: 'GENERAL', icon: Coins },
  { label: 'Cash', value: 'CASH', icon: Banknote },
  { label: 'Bank', value: 'BANK', icon: Landmark },
  { label: 'E - Wallet', value: 'E_WALLET', icon: Wallet },
  { label: 'Credit Card', value: 'CREDIT_CARD', icon: CreditCard },
  { label: 'Savings Account', value: 'SAVINGS_ACCOUNT', icon: PiggyBank },
  { label: 'Insurance', value: 'INSURANCE', icon: HandCoins },
  { label: 'Investment', value: 'INVESTMENT', icon: LineChart },
] satisfies Array<Choice<string>>

export const TRANSACTION_TYPES = [
  { label: 'Expense', value: 'EXPENSE', icon: ReceiptText },
  { label: 'Income', value: 'INCOME', icon: Banknote },
  { label: 'Add to Savings', value: 'SAVINGS', icon: PiggyBank },
  { label: 'Transfer to another wallet', value: 'TRANSFER', icon: Send },
] satisfies Array<Choice<string>>

export const COLORSCHEMES = [
  {
    base: 'black',
    primary: 'bg-black',
    secondary: 'bg-neutral-800',
    accent: 'bg-neutral-700',
    border: 'border-neutral-700',
    text: 'text-white',
    value: 'BLACK',
  },
  {
    base: 'white',
    primary: 'bg-white',
    secondary: 'bg-neutral-200',
    accent: 'bg-neutral-300',
    border: 'border-neutral-300',
    text: 'text-black',
    value: 'WHITE',
  },
  {
    base: 'green',
    primary: 'bg-green-700',
    secondary: 'bg-green-500',
    accent: 'bg-green-300',
    border: 'border-green-300',
    text: 'text-black',
    value: 'GREEN',
  },
  {
    base: 'red',
    primary: 'bg-red-700',
    secondary: 'bg-red-500',
    accent: 'bg-red-300',
    border: 'border-red-300',
    text: 'text-black',
    value: 'RED',
  },
  {
    base: 'orange',
    primary: 'bg-orange-700',
    secondary: 'bg-orange-500',
    accent: 'bg-orange-300',
    border: 'border-orange-300',
    text: 'text-black',
    value: 'ORANGE',
  },
  {
    base: 'blue',
    primary: 'bg-blue-700',
    secondary: 'bg-blue-500',
    accent: 'bg-blue-300',
    border: 'border-blue-300',
    text: 'text-black',
    value: 'BLUE',
  },
  {
    base: 'purple',
    primary: 'bg-purple-700',
    secondary: 'bg-purple-500',
    accent: 'bg-purple-300',
    border: 'border-purple-300',
    text: 'text-black',
    value: 'PURPLE',
  },
] satisfies Array<ColorScheme>

export const BUDGET_METHODS = [
  {
    label: 'Method 1: Needs / Wants / Savings',
    value: 'ThreeBucket',
    icon: PieChart,
  },
  {
    label: 'Method 2: Category-Based Budgeting',
    value: 'CategoryBased',
    icon: List,
  },
] satisfies Array<Choice<string>>

export const RECURRING_PERIODS = [
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Annually', value: 'ANNUALLY' },
] satisfies Array<Choice<string>>

export const THREE_BUCKET_CATEGORIES = [7, 8, 9, 10, 12, 13, 14, 3, 6]
export const INITIAL_BUDGETS = {
  ThreeBucket: [
    {
      categories: [7, 8, 9, 10],
      name: 'Needs',
      percentage: 60,
      totalAmount: 0,
    },
    {
      categories: [12, 13, 14],
      name: 'Wants',
      percentage: 20,
      totalAmount: 0,
    },
    {
      categories: [3, 6],
      name: 'Savings',
      percentage: 20,
      totalAmount: 0,
    },
  ],

  CategoryBased: [
    { categories: undefined, name: '', totalAmount: 0, percentage: 0 },
  ],
}
