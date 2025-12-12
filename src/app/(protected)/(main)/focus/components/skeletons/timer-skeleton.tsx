import { Skeleton } from '@/components/ui/skeleton';

export const TimerSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <Skeleton className="size-96 rounded-full" />
      <Skeleton className="h-10 w-full max-w-md rounded-none" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="size-12 rounded-full" />
      </div>
    </div>
  );
};
