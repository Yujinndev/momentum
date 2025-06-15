import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section className="mx-auto flex h-[80vh] w-full max-w-screen-2xl flex-col gap-x-4 gap-y-8">
      <Skeleton className="h-48 w-full" />

      <div className="grid h-full gap-4 lg:grid-cols-2">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    </section>
  )
}
