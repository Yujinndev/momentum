import { cn } from '@/lib/utils'
import { COLORSCHEMES, WALLET_TYPES } from '@/constants/choices'

interface Wallet {
  id?: string
  name: string
  color?: string | null
  description?: string | null
  balance: number | string
  type: string
  isDefault: boolean
}

export const WalletCard = ({ details }: { details: Wallet }) => {
  const type = WALLET_TYPES.find((type) => type.value === details.type)
  const color = COLORSCHEMES.find((color) => color.value === details.color)

  return (
    <div
      className={cn(
        'relative flex h-40 w-full flex-col justify-end overflow-hidden rounded-xl border px-6 py-4',
        color?.primary,
        color?.text
      )}
    >
      <div
        className={cn(
          'polygon absolute inset-y-0 left-10 w-full',
          color?.secondary
        )}
      />
      <div className={cn('polygon absolute inset-0 w-full', color?.accent)} />
      <div className="z-30">
        <h2 className="font-semibold">
          {details.name === '' ? 'Wallet Name' : details.name}
        </h2>
        <p className="font-mono text-base">
          {details.id?.slice(11, 13)}** **** ****
        </p>

        {/* {details.description ?? ''} */}

        <div className="flex justify-between pt-8">
          <div>
            <p className="text-sm">Available Balance</p>
            <h2 className="font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'Php',
              }).format(parseFloat(details.balance.toString()))}
            </h2>
          </div>
          <div className="flex flex-col items-end justify-center">
            {type?.icon && <type.icon />}
          </div>
        </div>
      </div>
    </div>
  )
}
