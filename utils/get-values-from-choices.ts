import { WALLET_TYPES, COLORSCHEMES, CURRENCIES } from '@/constants/choices'
import { Wallet } from '@/types/wallet'

export const getWalletType = (value: string) => {
  const type = WALLET_TYPES.find((type) => type.value === value)
  if (!type) throw new Error('No wallet type found')

  return type
}

export const getColorScheme = (value: string) => {
  const color = COLORSCHEMES.find((schemes) => schemes.value === value)
  if (!color) throw new Error('No color scheme found')

  return color
}

export const getWalletById = (wallets: Wallet[], value: string) => {
  const wallet = wallets.find((wallet) => wallet.id === value)
  if (!wallet) throw new Error('No wallet found')

  return wallet
}

export const getDefaultCurrency = () => {
  return CURRENCIES[0]
}
