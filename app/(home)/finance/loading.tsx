import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section className="relative mx-auto grid h-[80vh] w-full max-w-screen-2xl gap-4 xl:grid-cols-4">
      <Skeleton className="h-1/2 w-full" />
      <Skeleton className="h-full w-full px-3 py-3 xl:col-span-3" />
    </section>
  )
}
