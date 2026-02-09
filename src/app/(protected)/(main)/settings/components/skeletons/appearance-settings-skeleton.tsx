import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const AppearanceSettingsSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
    <Separator />
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-9 rounded-full" />
      </div>
    </div>
    <Separator />
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);
