import type { LucideIcon } from 'lucide-react'

export type ColorScheme = {
  base: string
  primary: string
  secondary: string
  accent: string
  border: string
  text: string
  value: string
}

export type Choice<T> = {
  label: string
  value: T
  icon?: LucideIcon
}
