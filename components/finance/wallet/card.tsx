import { cn } from '@/lib/utils'
import { Wallet } from '@/types/wallet'
import { getColorScheme, getWalletType } from '@/utils/get-values-from-choices'

export const WalletCard = ({ wallet }: { wallet: Wallet }) => {
  const color = getColorScheme(wallet?.color)
  const type = getWalletType(wallet?.type)

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
          {wallet?.name === '' ? 'Wallet Name' : wallet?.name}
        </h2>
        <p className="font-mono text-base">
          {wallet?.id?.slice(11, 13)}** **** ****
        </p>

        {/* {wallet.description ?? ''} */}

        <div className="flex justify-between pt-8">
          <div>
            <p className="text-sm">Available Balance</p>
            <h2 className="font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'Php',
              }).format(parseFloat(wallet?.balance?.toString()))}
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
