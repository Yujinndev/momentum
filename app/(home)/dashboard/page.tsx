import { WalletList } from './_components/wallet-list'

export default async function Dashboard() {
  return (
    <section>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <WalletList />
      </div>
    </section>
  )
}
