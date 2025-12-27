import { MetricCardSkeleton } from '@/app/(protected)/(main)/components/metric-card';

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}
