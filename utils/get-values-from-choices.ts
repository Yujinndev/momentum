import { WalletWithId } from '@/types/wallet'
import { WALLET_TYPES, COLORSCHEMES, CURRENCIES } from '@/constants/choices'

export const getWalletType = (value: string) => {
  const type = WALLET_TYPES.find((type) => type.value === value)
  if (!type) throw new Error('No wallet type found')

  return type
}

export const getColorScheme = (value: string | null) => {
  const color = COLORSCHEMES.find((schemes) => schemes.value === value)
  if (!color) throw new Error('No color scheme found')

  return color
}

export const getWalletById = (wallets: WalletWithId[], value: string) => {
  const wallet = wallets.find((wallet) => wallet.id === value)

  return wallet
}

export const getDefaultCurrency = () => {
  return CURRENCIES[0]
}
