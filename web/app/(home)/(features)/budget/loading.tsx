import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="relative mx-auto h-[80vh] w-full max-w-screen-xl space-y-6 rounded-md">
      <Skeleton className="h-1/3 w-full" />
      <Skeleton className="h-2/3 w-full" />
    </div>
  )
}
