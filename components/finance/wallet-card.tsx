import { cn } from '@/lib/utils'
import { Wallet } from '@/types/wallet'
import { getColorScheme, getWalletType } from '@/utils/get-values-from-choices'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

type WalletCardProps = {
  wallet: Wallet & { id?: string }
  onEdit?: () => void
  className?: string
}

export const WalletCard = ({ wallet, onEdit, className }: WalletCardProps) => {
  const color = getColorScheme(wallet?.color)
  const type = getWalletType(wallet?.type)

  return (
    <div data-id={wallet.id} className={cn('wallet-card relative', className)}>
      {onEdit && (
        <Button
          variant="ghost"
          className={cn(
            'absolute right-2 top-2 z-30 h-8 w-8 rounded-full',
            color?.text
          )}
          onClick={onEdit}
        >
          <Pencil size={16} />
        </Button>
      )}

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

        <div className="z-30 flex h-full flex-col justify-between">
          <h2 className="font-semibold">
            {wallet?.name !== '' ? (
              <span>{wallet.name}</span>
            ) : (
              <span className="font-light text-zinc-400 dark:text-zinc-400">
                Unnamed
              </span>
            )}
          </h2>
          <p className="text-base font-light">{wallet.description}</p>

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
    </div>
  )
}
