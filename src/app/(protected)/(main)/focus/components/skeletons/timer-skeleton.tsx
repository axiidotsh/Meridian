import { Skeleton } from '@/components/ui/skeleton';

export const TimerSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="flex flex-col items-center gap-10">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="size-60 rounded-full sm:size-72" />
        <Skeleton className="h-10 w-full max-w-sm sm:w-96" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="size-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};
