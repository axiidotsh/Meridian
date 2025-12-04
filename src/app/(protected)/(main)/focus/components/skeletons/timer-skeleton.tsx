import { Skeleton } from '@/components/ui/skeleton';

export function TimerSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      <Skeleton className="h-20 w-48" />
      <Skeleton className="h-10 w-64" />
      <div className="flex gap-2">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="size-12 rounded-full" />
      </div>
    </div>
  );
}
